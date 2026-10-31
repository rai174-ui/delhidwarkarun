import fs from "fs";
import path from "path";

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

export function saveRegistration(
  input: Omit<StoredRegistration, "id" | "bib" | "registeredAt"> & {
    bib?: string;
  }
): StoredRegistration {
  const existing = getAllRegistrations();

  // Generate a unique category-prefixed sequential/unique Bib number
  const prefix =
    input.categoryId === "half"
      ? "21"
      : input.categoryId === "10.5k"
      ? "10"
      : input.categoryId === "5k"
      ? "50"
      : "30";

  const usedBibs = new Set(existing.map((r) => r.bib));
  let bib = input.bib || "";
  if (!bib || usedBibs.has(bib)) {
    const categoryCount = existing.filter(
      (r) => r.categoryId === input.categoryId
    ).length;
    let candidateNum = 101 + categoryCount;
    bib = `${prefix}${candidateNum}`;
    while (usedBibs.has(bib)) {
      candidateNum++;
      bib = `${prefix}${candidateNum}`;
    }
  }

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
