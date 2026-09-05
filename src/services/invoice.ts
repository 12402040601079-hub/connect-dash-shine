export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  taskTitle: string;
  category: string;
  requesterName: string;
  requesterGstin?: string;
  helperName: string;
  location: string;
  baseAmount: number;
  insuranceAmount: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
  sacCode: string;
  paymentStatus: "paid" | "escrow_held" | "pending";
}

export function generateGstInvoice(task: {
  id?: string;
  title?: string;
  category?: string;
  budget?: number;
  acceptedAmount?: number;
  posterName?: string;
  helperName?: string;
  location?: string;
  hasInsurance?: boolean;
}): InvoiceData {
  const baseAmount = Number(task.acceptedAmount || task.budget || 350);
  const insuranceAmount = task.hasInsurance ? 9 : 0;
  
  // Standard 18% GST (9% CGST + 9% SGST) for on-demand marketplace facilitation
  const taxableValue = baseAmount;
  const cgstAmount = Math.round((taxableValue * 0.09) * 100) / 100;
  const sgstAmount = Math.round((taxableValue * 0.09) * 100) / 100;
  const totalAmount = baseAmount + insuranceAmount;

  const invoiceNumber = `ML-INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    invoiceNumber,
    date,
    taskTitle: task.title || "Home Errand & On-Demand Service",
    category: task.category || "General Chore",
    requesterName: task.posterName || "Verified Requester",
    requesterGstin: "24AAACM1234F1Z5", // Gujarat State code 24
    helperName: task.helperName || "Verified MicroLink Helper",
    location: task.location || "Ahmedabad, Gujarat, India",
    baseAmount,
    insuranceAmount,
    cgstRate: 9,
    sgstRate: 9,
    cgstAmount,
    sgstAmount,
    totalAmount,
    sacCode: "998729", // Maintenance & Repair Services SAC
    paymentStatus: "paid",
  };
}
