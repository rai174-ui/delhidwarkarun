"use client";

import React, { useState } from "react";
import { RACE_CATEGORIES, RaceCategory, RunnerResult, START_VENUE } from "../data/raceData";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RegistrationModalProps {
  initialCategory: RaceCategory;
  onClose: () => void;
  onSuccessRegister: (entry: RunnerResult) => void;
}

export default function RegistrationModal({
  initialCategory,
  onClose,
  onSuccessRegister,
}: RegistrationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<RaceCategory>(initialCategory);
  const [couponCode, setCouponCode] = useState("DDR50");
  const [discountApplied, setDiscountApplied] = useState(true); // 50% OFF till 30-Nov-2026 auto-applied
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedBib, setConfirmedBib] = useState<{
    bib: string;
    txnId: string;
    name: string;
    category: string;
    distance: string;
    startTime: string;
    gender: string;
    tshirtSize: string;
    amountPaid: number;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "Male",
    bloodGroup: "O+",
    tshirtSize: "M",
    emergencyName: "",
    emergencyPhone: "",
    medicalDeclaration: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Please enter your full name (minimum 3 characters).";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, "").slice(-10))) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!formData.dob) {
      newErrors.dob = "Please select your Date of Birth.";
    }
    if (!formData.emergencyName || formData.emergencyName.trim().length < 2) {
      newErrors.emergencyName = "Emergency contact name is required.";
    }
    if (
      !formData.emergencyPhone ||
      !/^[6-9]\d{9}$/.test(formData.emergencyPhone.replace(/\D/g, "").slice(-10))
    ) {
      newErrors.emergencyPhone = "Enter a valid 10-digit emergency contact number.";
    }
    if (
      formData.mobile &&
      formData.emergencyPhone &&
      formData.mobile.replace(/\D/g, "").slice(-10) ===
        formData.emergencyPhone.replace(/\D/g, "").slice(-10)
    ) {
      newErrors.emergencyPhone = "Emergency number must differ from runner's mobile number.";
    }
    if (!formData.medicalDeclaration) {
      newErrors.medicalDeclaration =
        "You must accept the medical & fitness declaration to participate.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const originalFee = category.originalFee;
  const discountAmount = discountApplied ? Math.round(originalFee * 0.5) : 0;
  const totalPayable = originalFee - discountAmount;

  const finalizeRegistration = async (
    paymentId: string,
    orderId: string = "",
    mode: string = "razorpay"
  ) => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        tshirtSize: formData.tshirtSize,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        categoryId: category.id,
        categoryName: category.name,
        distance: category.distance,
        startTime: category.startTime,
        originalFee,
        discountAmount,
        amountPaid: totalPayable,
        couponCode: discountApplied ? couponCode || "DDR50" : "",
        paymentId,
        orderId,
        paymentMode: mode,
      };

      const saveRes = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saveData = await saveRes.json();
      const savedRecord = saveData?.registration;

      const prefix =
        category.id === "half"
          ? "21"
          : category.id === "10.5k"
          ? "10"
          : category.id === "5k"
          ? "50"
          : "30";
      const assignedBib =
        savedRecord?.bib || prefix + Math.floor(100 + Math.random() * 899);

      // Also store a local browser backup copy
      if (typeof window !== "undefined") {
        try {
          const existingRaw = localStorage.getItem("ddr2027_registrations_backup");
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          const backupEntry = savedRecord || {
            id: `reg_${Date.now()}`,
            bib: assignedBib,
            registeredAt: new Date().toISOString(),
            ...payload,
            paymentStatus: "PAID",
          };
          localStorage.setItem(
            "ddr2027_registrations_backup",
            JSON.stringify([backupEntry, ...existingList])
          );
        } catch {}
      }

      const confirmedObj = {
        bib: assignedBib,
        txnId: paymentId,
        name: formData.fullName,
        category: category.name,
        distance: category.distance,
        startTime: category.startTime,
        gender: formData.gender,
        tshirtSize: formData.tshirtSize,
        amountPaid: totalPayable,
      };

      setConfirmedBib(confirmedObj);
      setIsProcessingPayment(false);
      setStep(3);
      onSuccessRegister({
        bib: assignedBib,
        name: formData.fullName,
        category: category.name,
        gender: formData.gender,
        netTime: "Registered (14-Feb-2027)",
        pace: "Lucky Draw Eligible",
        isNew: true,
      });
    } catch (err: any) {
      setPaymentError(err?.message || "Failed to save registration record.");
      setIsProcessingPayment(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create order on backend API (amount in paise)
      const amountInPaise = Math.round(Number(totalPayable) * 100);
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `ddr27_${Date.now()}`,
          categoryId: category.id,
          categoryName: category.name,
          runnerName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Could not initiate Razorpay order.");
      }

      const razorpayKeyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId;
      const orderId = orderData.order_id || orderData.orderId;

      if (!razorpayKeyId || !orderId) {
        throw new Error("Missing Razorpay order ID or key configuration.");
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout SDK failed to load. Please check your internet connection."
        );
      }

      // 2. Open Razorpay Standard Checkout modal with order_id
      const options: any = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Delhi Dwarka Run 2027",
        description: `4th Edition Dwarka Half Marathon — ${category.name}`,
        order_id: orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          category: category.name,
          tshirtSize: formData.tshirtSize,
          eventDate: "14-Feb-2027",
          startingPoint: START_VENUE,
        },
        theme: {
          color: "#F26522",
        },
        modal: {
          ondismiss: () => {
            setPaymentError("Payment cancelled. You can click Pay again whenever you are ready.");
            setIsProcessingPayment(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              setPaymentError(
                verifyData.error ||
                  "Payment signature verification failed. Please contact support."
              );
              setIsProcessingPayment(false);
              return;
            }
            await finalizeRegistration(
              response.razorpay_payment_id,
              response.razorpay_order_id || orderId,
              "razorpay_live"
            );
          } catch (err: any) {
            setPaymentError(err?.message || "Error verifying payment.");
            setIsProcessingPayment(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setPaymentError(
          response?.error?.description || "Payment failed. Please try again."
        );
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err?.message || "Payment initialization failed.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-5 flex items-center justify-between shrink-0 border-b border-[#29ABE2]/30">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/ddr-logo.png"
              alt="DDR Logo"
              className="w-12 h-12 rounded-xl bg-[#C5D887] p-1 object-contain border border-[#F26522] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5D887] text-navy-950 text-[11px] font-display font-black uppercase tracking-wider">
                  50% OFF Till 30-Nov-2026
                </span>
                <span className="text-xs text-slate-300">
                  Event Date: 14-Feb-2027 • Step {step} of 3
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl mt-1">
                {step === 1 && "Runner Registration & Live Bib Preview"}
                {step === 2 && "50% Discount Summary & Razorpay Checkout"}
                {step === 3 && "Registration Confirmed & Official E-Bib"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 h-1.5 w-full shrink-0">
          <div
            className="bg-gradient-to-r from-[#29ABE2] via-coral-500 to-[#C5D887] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5" noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Race Category (50% Discount Applied Till 30-Nov-2026) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {RACE_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        category.id === cat.id
                          ? "border-coral-500 bg-coral-500/10 ring-2 ring-coral-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <div className="font-athletic font-bold text-2xl leading-none text-navy-900">
                        {cat.distance}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 line-through mt-1">
                        ₹{cat.originalFee}
                      </div>
                      <div className="font-display font-black text-sm text-emerald-600">
                        ₹{cat.fee}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Dynamic Bib Preview Strip */}
              <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-[#0284C7]/60 rounded-2xl p-4 text-white flex items-center justify-between border border-[#29ABE2]/50">
                <div>
                  <div className="text-[10px] font-display font-bold uppercase text-[#C5D887]">
                    DDR 4th Edition • 14-Feb-2027 • {START_VENUE}
                  </div>
                  <div className="font-display font-black text-lg uppercase tracking-wide text-white mt-0.5">
                    {formData.fullName ? formData.fullName : "YOUR NAME ON BIB"}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {category.name} • Tee Size: {formData.tshirtSize} • 🎁 Lucky Draw Included
                  </div>
                </div>
                <div className="text-right bg-[#C5D887] text-navy-950 px-3.5 py-2 rounded-xl font-athletic font-bold text-2xl leading-none shrink-0">
                  {category.distance}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Full Name (as on ID) *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="e.g. Siddharth Kapoor"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="runner@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.email ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    placeholder="9876543210"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.mobile ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.dob ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary / Other">Non-Binary / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Dry-Fit T-Shirt Size *
                  </label>
                  <select
                    value={formData.tshirtSize}
                    onChange={(e) => handleChange("tshirtSize", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="S">Small (S - Chest 38&quot;)</option>
                    <option value="M">Medium (M - Chest 40&quot;)</option>
                    <option value="L">Large (L - Chest 42&quot;)</option>
                    <option value="XL">X-Large (XL - Chest 44&quot;)</option>
                    <option value="XXL">XX-Large (XXL - Chest 46&quot;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => handleChange("emergencyName", e.target.value)}
                    placeholder="Spouse / Parent / Friend"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.emergencyName ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.emergencyName && (
                    <p className="text-xs text-red-600 mt-1">{errors.emergencyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                    placeholder="9811122233"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                      errors.emergencyPhone ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.emergencyPhone && (
                    <p className="text-xs text-red-600 mt-1">{errors.emergencyPhone}</p>
                  )}
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  errors.medicalDeclaration
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalDeclaration}
                    onChange={(e) => handleChange("medicalDeclaration", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-coral-500 rounded"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    <strong>Medical &amp; Fitness Declaration:</strong> I declare that I am
                    physically fit and trained to participate in the{" "}
                    <strong>{category.name}</strong> starting at{" "}
                    <strong>Max Hospital, Sector 10, Dwarka, New Delhi</strong> on 14-Feb-2027.
                  </span>
                </label>
                {errors.medicalDeclaration && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    {errors.medicalDeclaration}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm px-7 py-3.5 rounded-xl shadow-glow transition-all"
                >
                  Continue to Summary &amp; Payment (₹{category.fee}) →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-coral-600">
                      Selected Category • 14-Feb-2027
                    </span>
                    <h4 className="font-display font-extrabold text-lg text-navy-900">
                      {category.name}
                    </h4>
                    <p className="text-xs text-slate-500">Starting Point: {START_VENUE}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-coral-600 underline"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Runner Name</span>
                    <span className="font-semibold text-navy-900">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobile</span>
                    <span className="font-semibold text-navy-900">{formData.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">T-Shirt Size &amp; Gender</span>
                    <span className="font-semibold text-navy-900">
                      Size {formData.tshirtSize} • {formData.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code (DDR50 - 50% OFF till 30-Nov-2026)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-400 bg-emerald-50/40 text-sm uppercase font-mono font-bold text-emerald-800"
                />
                <button
                  type="button"
                  onClick={() => setDiscountApplied(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-display font-bold text-xs uppercase tracking-wider"
                >
                  50% Applied ✓
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{category.name} Regular Fee</span>
                  <span className="font-semibold text-slate-400 line-through">
                    ₹{originalFee}.00
                  </span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>50% Early Bird Discount (Valid till 30-Nov-2026)</span>
                    <span>- ₹{discountAmount}.00</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="font-display font-bold text-navy-900 text-base">
                    Net Payable (50% OFF)
                  </span>
                  <span className="font-display font-black text-2xl text-emerald-600">
                    ₹{totalPayable}.00
                  </span>
                </div>
              </div>

              {paymentError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  ⚠️ {paymentError}
                </div>
              )}

              <div className="border-2 border-indigo-600/20 bg-indigo-50/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-display font-black text-xs flex items-center justify-center">
                      R
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-navy-900">
                        Razorpay Payment Gateway
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Supports UPI, GPay, PhonePe, Cards &amp; NetBanking
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded">
                    128-BIT SSL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs font-semibold">
                  {(
                    [
                      { id: "upi", label: "⚡ UPI / QR" },
                      { id: "card", label: "💳 Card" },
                      { id: "netbanking", label: "🏦 NetBanking" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === m.id
                          ? "border-indigo-600 bg-white text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white/60 text-slate-600"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleRazorpayCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-display font-extrabold text-base py-4 rounded-xl shadow-lg transition-all"
                >
                  {isProcessingPayment
                    ? "Opening Razorpay Gateway..."
                    : `Pay ₹${totalPayable} via Razorpay`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && confirmedBib && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                🎉
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase">
                  Payment Successful • {confirmedBib.txnId}
                </span>
                <h4 className="font-display font-black text-2xl text-navy-900 mt-2">
                  See You at Max Hospital Sector 10, {confirmedBib.name}!
                </h4>
              </div>

              <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white rounded-3xl p-6 max-w-md mx-auto border-2 border-coral-500 shadow-2xl text-left">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="font-display font-black text-xs tracking-wider text-coral-400">
                    4TH DWARKA HALF MARATHON • 14-FEB-2027
                  </div>
                  <span className="px-2.5 py-1 rounded bg-white text-navy-900 font-display font-black text-xs">
                    {confirmedBib.distance}
                  </span>
                </div>
                <div className="py-5 text-center border-b border-white/15">
                  <div className="text-xs uppercase tracking-widest text-slate-400">
                    Official Runner Bib Number
                  </div>
                  <div className="font-display font-black text-5xl tracking-wider text-white mt-1">
                    #{confirmedBib.bib}
                  </div>
                  <div className="text-sm font-display font-bold text-volt mt-1 uppercase">
                    {confirmedBib.name}
                  </div>
                </div>
                <div className="pt-4 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Flag-Off</span>
                    <span className="font-bold">{confirmedBib.startTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tee Size</span>
                    <span className="font-bold">Size {confirmedBib.tshirtSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Paid (50% Off)</span>
                    <span className="font-bold text-emerald-400">₹{confirmedBib.amountPaid}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-7 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm shadow-glow"
                >
                  Done &amp; View Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
