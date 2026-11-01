import fs from "fs";
import path from "path";
import Razorpay from "razorpay";

export interface StoredRegistration {
  id: string;
  bib: string; // Stores the official Registration Number (e.g. "0426-0001")
  registrationNumber?: string; // Alias for bib ("0426-0001")
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

const REG_PREFIX = "0426-";

export function formatRegistrationNumber(seq: number): string {
  const safeSeq = Math.max(1, Math.floor(seq));
  return `${REG_PREFIX}${String(safeSeq).padStart(4, "0")}`;
}

/**
 * Extracts the sequential numeric suffix from a Registration Number (e.g. "0426-0001" -> 1)
 */
function extractRegistrationSequence(regNo: string): number {
  const trimmed = String(regNo || "").trim();
  const match = trimmed.match(/^0426-(\d+)$/);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 0;
}

/**
 * Allocates the next strictly incrementing, globally unique Registration Number
 * starting from 0426-0001, 0426-0002, 0426-0003...
 */
export function allocateNextRegistrationNumber(
  existingRecords: StoredRegistration[],
  minHistoricalCount: number = 0
): string {
  const usedRegNumbers = new Set<string>();
  const usedSequences = new Set<number>();

  let maxSequence = 0;

  for (const rec of existingRecords) {
    const code = String(rec.registrationNumber || rec.bib || "").trim();
    if (code) {
      usedRegNumbers.add(code);
      const seq = extractRegistrationSequence(code);
      if (seq > 0) {
        usedSequences.add(seq);
        if (seq > maxSequence) {
          maxSequence = seq;
        }
      }
    }
  }

  let nextSeq =
    Math.max(maxSequence, existingRecords.length, minHistoricalCount) + 1;

  let candidate = formatRegistrationNumber(nextSeq);
  while (usedRegNumbers.has(candidate) || usedSequences.has(nextSeq)) {
    nextSeq++;
    candidate = formatRegistrationNumber(nextSeq);
  }

  return candidate;
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
    if (!Array.isArray(parsed)) return [];
    // Filter out any legacy ₹1 test records that did not use the 0426-XXXX format
    return parsed.filter(
      (r) =>
        r &&
        (String(r.bib || "").startsWith(REG_PREFIX) || Number(r.amountPaid) > 1)
    );
  } catch (err) {
    console.error("Error reading registrations store:", err);
    return [];
  }
}

/**
 * Syncs official paid registrations from Razorpay API so that even if the container restarts or redeploys,
 * all registrations and their sequential 0426-XXXX Registration Numbers are preserved and never reused.
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
    return {
      records: localRecords,
      razorpayHistoricalCount: localRecords.length,
    };
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

    // Exclude legacy ₹1 (100 paise) gateway test payments so real registrations start cleanly at 0426-0001
    const validPayments = items
      .filter(
        (p) =>
          p &&
          (p.status === "captured" || p.status === "authorized") &&
          Number(p.amount) > 100
      )
      .sort((a, b) => (Number(a.created_at) || 0) - (Number(b.created_at) || 0));

    const byPaymentId = new Map<string, StoredRegistration>();
    for (const r of localRecords) {
      if (r.paymentId) {
        byPaymentId.set(r.paymentId, r);
      }
    }

    let changed = false;
    const workingList = [...localRecords].sort(
      (a, b) =>
        new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    );

    // Normalize any existing non-0426 records in chronological order
    for (let i = 0; i < workingList.length; i++) {
      if (!String(workingList[i].bib || "").startsWith(REG_PREFIX)) {
        const regNo = allocateNextRegistrationNumber(
          workingList.slice(0, i),
          i
        );
        workingList[i].bib = regNo;
        workingList[i].registrationNumber = regNo;
        changed = true;
      }
    }

    for (let i = 0; i < validPayments.length; i++) {
      const p = validPayments[i];
      if (!p.id || byPaymentId.has(p.id)) {
        continue;
      }

      const notes = p.notes || {};
      const catId = notes.categoryId || "half";
      const catName =
        notes.categoryName || notes.category || "Half Marathon (21.097 KM)";
      const dist = notes.distance || "21.097 KM";
      const paidInr = Math.round((Number(p.amount) || 0) / 100);

      const allocatedRegNo = allocateNextRegistrationNumber(workingList, i);

      const recovered: StoredRegistration = {
        id: `reg_${p.created_at || Date.now()}_${String(p.id).slice(-5)}`,
        bib: allocatedRegNo,
        registrationNumber: allocatedRegNo,
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
    return {
      records: localRecords,
      razorpayHistoricalCount: localRecords.length,
    };
  }
}

export async function saveRegistration(
  input: Omit<StoredRegistration, "id" | "bib" | "registeredAt"> & {
    bib?: string;
  }
): Promise<StoredRegistration> {
  const { records: existing, razorpayHistoricalCount } =
    await syncAndGetRegistrations();

  // 1. Idempotency check: if this paymentId already has an allocated Registration Number, return it
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

  // 2. Strictly increment and allocate a unique Registration Number starting at 0426-0001
  const registrationNumber = allocateNextRegistrationNumber(
    existing,
    razorpayHistoricalCount
  );

  const newRecord: StoredRegistration = {
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    bib: registrationNumber,
    registrationNumber,
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
    "Registration Number",
    "Bib Number Status",
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
      r.registrationNumber || r.bib,
      "To be issued by 3rd party timing partner",
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
