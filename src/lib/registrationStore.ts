import fs from "fs";
import path from "path";
import Razorpay from "razorpay";
import { INITIAL_RESULTS } from "../data/raceData";

export interface StoredRegistration {
  id: string;
  bib: string;
  registeredAt: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  tshirtSize: string;
  emergencyName: string;
  emergencyPhone: string;
  categoryId: string;
  categoryName: string;
  distance: string;
  startTime: string;
  originalFee: number;
  discountAmount: number;
  amountPaid: number;
  couponCode: string;
  paymentId: string;
  orderId: string;
  paymentMode: string;
  paymentStatus: "PAID";
}

const RESERVED_BIBS = new Set(INITIAL_RESULTS.map((r) => String(r.bib).trim()));

export function getCategoryBibPrefix(categoryId: string): string {
  switch (categoryId) {
    case "half":
      return "21";
    case "10.5k":
      return "10";
    case "5k":
      return "50";
    case "3k":
      return "30";
    case "test1":
      return "90";
    default:
      return "30";
  }
}

/**
 * Extracts the sequential numeric suffix from a Bib string (e.g. "21105" -> 105, "90102" -> 102)
 */
function extractBibSequence(bib: string): number {
  const digits = String(bib || "").replace(/\D/g, "");
  if (digits.length >= 5) {
    const suffix = Number(digits.slice(2));
    if (!Number.isNaN(suffix) && suffix > 0) return suffix;
  }
  const num = Number(digits);
  return !Number.isNaN(num) ? num : 100;
}

/**
 * Allocates the next strictly incrementing, globally unique Bib number
 */
export function allocateNextUniqueBib(
  categoryId: string,
  existingRecords: StoredRegistration[],
  minHistoricalCount: number = 0
): string {
  const prefix = getCategoryBibPrefix(categoryId);
  const usedBibs = new Set<string>(RESERVED_BIBS);
  const usedSequences = new Set<number>();

  let maxSequence = 100;

  for (const rec of existingRecords) {
    if (rec.bib) {
      const cleanBib = String(rec.bib).trim();
      usedBibs.add(cleanBib);
      const seq = extractBibSequence(cleanBib);
      usedSequences.add(seq);
      if (seq > maxSequence) {
        maxSequence = seq;
      }
    }
  }

  // Ensure sequence is strictly greater than maxSequence AND accounts for historical count
  let nextSeq =
    Math.max(maxSequence, 100 + existingRecords.length, 100 + minHistoricalCount) + 1;

  let candidateBib = `${prefix}${nextSeq}`;
  while (usedBibs.has(candidateBib) || usedSequences.has(nextSeq)) {
    nextSeq++;
    candidateBib = `${prefix}${nextSeq}`;
  }

  return candidateBib;
}

function getStoreFilePath(): string {
  if (process.env.REGISTRATIONS_DATA_PATH) {
    return process.env.REGISTRATIONS_DATA_PATH;
  }
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "registrations.json");
}

export function getAllRegistrations(): StoredRegistration[] {
  try {
    const filePath = getStoreFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading registrations store:", err);
    return [];
  }
}

/**
 * Syncs captured payments from Razorpay API so that even if the container restarts or redeploys,
 * all previous registrations and their sequential Bib numbers are preserved and never reused.
 */
export async function syncAndGetRegistrations(): Promise<{
  records: StoredRegistration[];
  razorpayHistoricalCount: number;
}> {
  const localRecords = getAllRegistrations();

  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { records: localRecords, razorpayHistoricalCount: localRecords.length };
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const paymentsResp: any = await razorpay.payments.all({ count: 100 });
    const items: any[] = Array.isArray(paymentsResp?.items)
      ? paymentsResp.items
      : [];

    // Filter to captured/authorized payments on this Razorpay account, sorted oldest -> newest
    const validPayments = items
      .filter(
        (p) => p && (p.status === "captured" || p.status === "authorized")
      )
      .sort((a, b) => (Number(a.created_at) || 0) - (Number(b.created_at) || 0));

    const byPaymentId = new Map<string, StoredRegistration>();
    for (const r of localRecords) {
      if (r.paymentId) {
        byPaymentId.set(r.paymentId, r);
      }
    }

    let changed = false;
    // Reconstruct any missing registrations from Razorpay payment notes in chronological order
    const workingList = [...localRecords].sort(
      (a, b) =>
        new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    );

    for (let i = 0; i < validPayments.length; i++) {
      const p = validPayments[i];
      if (!p.id || byPaymentId.has(p.id)) {
        continue;
      }

      const notes = p.notes || {};
      const catId = notes.categoryId || (p.amount === 100 ? "test1" : "half");
      const catName =
        notes.categoryName ||
        notes.category ||
        (p.amount === 100
          ? "Gateway Test Payment (₹1)"
          : "Half Marathon (21.097 KM)");
      const dist =
        notes.distance || (p.amount === 100 ? "TEST ₹1" : "21.097 KM");
      const paidInr = Math.round((Number(p.amount) || 0) / 100);

      const allocatedBib = allocateNextUniqueBib(catId, workingList, i);

      const recovered: StoredRegistration = {
        id: `reg_${p.created_at || Date.now()}_${String(p.id).slice(-5)}`,
        bib: allocatedBib,
        registeredAt: p.created_at
          ? new Date(Number(p.created_at) * 1000).toISOString()
          : new Date().toISOString(),
        fullName:
          notes.fullName || notes.runnerName || notes.name || "Registered Runner",
        email: p.email || notes.email || "",
        mobile: p.contact || notes.mobile || notes.contact || "",
        dob: notes.dob || "",
        gender: notes.gender || "Male",
        bloodGroup: notes.bloodGroup || "O+",
        tshirtSize: notes.tshirtSize || "M",
        emergencyName: notes.emergencyName || "",
        emergencyPhone: notes.emergencyPhone || "",
        categoryId: catId,
        categoryName: catName,
        distance: dist,
        startTime: notes.startTime || "05:30 AM",
        originalFee: Number(notes.originalFee) || paidInr * 2,
        discountAmount: Number(notes.discountAmount) || paidInr,
        amountPaid: paidInr,
        couponCode: "DDR50",
        paymentId: p.id,
        orderId: p.order_id || "",
        paymentMode: p.method || "razorpay",
        paymentStatus: "PAID",
      };

      workingList.push(recovered);
      byPaymentId.set(p.id, recovered);
      changed = true;
    }

    // Sort newest first for display/storage
    const newestFirst = [...workingList].sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );

    if (changed) {
      try {
        fs.writeFileSync(
          getStoreFilePath(),
          JSON.stringify(newestFirst, null, 2),
          "utf-8"
        );
      } catch (writeErr) {
        console.error("Failed writing synced registrations:", writeErr);
      }
    }

    return {
      records: newestFirst,
      razorpayHistoricalCount: validPayments.length,
    };
  } catch (err) {
    console.error("Razorpay sync warning (using local store):", err);
    return { records: localRecords, razorpayHistoricalCount: localRecords.length };
  }
}

export async function saveRegistration(
  input: Omit<StoredRegistration, "id" | "bib" | "registeredAt"> & {
    bib?: string;
  }
): Promise<StoredRegistration> {
  const { records: existing, razorpayHistoricalCount } =
    await syncAndGetRegistrations();

  // 1. Idempotency check: if this paymentId already has an allocated Bib, update its runner details & return that exact Bib
  if (input.paymentId) {
    const existingIdx = existing.findIndex(
      (r) => r.paymentId === input.paymentId
    );
    if (existingIdx !== -1) {
      const current = existing[existingIdx];
      const updatedRecord: StoredRegistration = {
        ...current,
        fullName: input.fullName || current.fullName,
        email: input.email || current.email,
        mobile: input.mobile || current.mobile,
        dob: input.dob || current.dob,
        gender: input.gender || current.gender,
        bloodGroup: input.bloodGroup || current.bloodGroup,
        tshirtSize: input.tshirtSize || current.tshirtSize,
        emergencyName: input.emergencyName || current.emergencyName,
        emergencyPhone: input.emergencyPhone || current.emergencyPhone,
        categoryId: input.categoryId || current.categoryId,
        categoryName: input.categoryName || current.categoryName,
        distance: input.distance || current.distance,
        startTime: input.startTime || current.startTime,
      };
      existing[existingIdx] = updatedRecord;
      try {
        fs.writeFileSync(
          getStoreFilePath(),
          JSON.stringify(existing, null, 2),
          "utf-8"
        );
      } catch {}
      return updatedRecord;
    }
  }

  // 2. Strictly increment and allocate a 100% unique Bib number
  const bib = allocateNextUniqueBib(
    input.categoryId,
    existing,
    razorpayHistoricalCount
  );

  const newRecord: StoredRegistration = {
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    bib,
    registeredAt: new Date().toISOString(),
    fullName: input.fullName,
    email: input.email,
    mobile: input.mobile,
    dob: input.dob,
    gender: input.gender,
    bloodGroup: input.bloodGroup || "O+",
    tshirtSize: input.tshirtSize,
    emergencyName: input.emergencyName,
    emergencyPhone: input.emergencyPhone,
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    distance: input.distance,
    startTime: input.startTime,
    originalFee: Number(input.originalFee) || 0,
    discountAmount: Number(input.discountAmount) || 0,
    amountPaid: Number(input.amountPaid) || 0,
    couponCode: input.couponCode || "DDR50",
    paymentId: input.paymentId,
    orderId: input.orderId || "",
    paymentMode: input.paymentMode || "razorpay",
    paymentStatus: "PAID",
  };

  const updated = [newRecord, ...existing];
  const filePath = getStoreFilePath();
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return newRecord;
}

export function convertRegistrationsToCSV(
  records: StoredRegistration[]
): string {
  const headers = [
    "Registration ID",
    "Bib Number",
    "Registration Date (UTC)",
    "Full Name",
    "Email",
    "Mobile Number",
    "Date of Birth",
    "Gender",
    "Blood Group",
    "T-Shirt Size",
    "Emergency Contact Name",
    "Emergency Contact Phone",
    "Category Name",
    "Distance",
    "Flag-Off Time",
    "Original Fee (INR)",
    "Discount (INR)",
    "Net Amount Paid (INR)",
    "Coupon Code",
    "Razorpay Payment ID",
    "Razorpay Order ID",
    "Payment Mode",
    "Payment Status",
  ];

  const escapeCsv = (val: any) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) =>
    [
      r.id,
      r.bib,
      r.registeredAt,
      r.fullName,
      r.email,
      r.mobile,
      r.dob,
      r.gender,
      r.bloodGroup,
      r.tshirtSize,
      r.emergencyName,
      r.emergencyPhone,
      r.categoryName,
      r.distance,
      r.startTime,
      r.originalFee,
      r.discountAmount,
      r.amountPaid,
      r.couponCode,
      r.paymentId,
      r.orderId,
      r.paymentMode,
      r.paymentStatus,
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [headers.map(escapeCsv).join(","), ...rows].join("\n");
}
