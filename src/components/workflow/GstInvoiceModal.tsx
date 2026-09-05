import React from "react";
import { type InvoiceData } from "@/services/invoice";
import { sound } from "@/services/sound";

interface GstInvoiceModalProps {
  invoice: InvoiceData;
  isDark?: boolean;
  onClose: () => void;
}

export default function GstInvoiceModal({
  invoice,
  isDark = false,
  onClose,
}: GstInvoiceModalProps) {
  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden bg-white text-slate-900"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow">
              M
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                MicroLink Technologies Private Limited
              </h3>
              <p className="text-[11px] text-slate-500">
                GSTIN: 24AAACM1234F1Z5 · Ahmedabad, Gujarat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1.5 cursor-pointer rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Invoice Meta */}
        <div className="flex justify-between items-start mb-6 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To:
            </span>
            <div className="font-extrabold text-slate-900 text-sm">{invoice.requesterName}</div>
            <div className="text-slate-500">{invoice.location}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-indigo-600 mb-0.5">
              {invoice.invoiceNumber}
            </div>
            <div className="text-slate-500">Date: {invoice.date}</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 mt-1">
              PAID VIA UPI ESCROW
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">SAC Code</th>
                <th className="p-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{invoice.taskTitle}</div>
                  <div className="text-[11px] text-slate-400">Assigned Helper: {invoice.helperName}</div>
                </td>
                <td className="p-3 text-center font-mono text-slate-500">{invoice.sacCode}</td>
                <td className="p-3 text-right font-mono font-bold">₹{invoice.baseAmount.toFixed(2)}</td>
              </tr>
              {invoice.insuranceAmount > 0 && (
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-emerald-700">🛡️ Digit/Acko On-Demand Gig Insurance</div>
                    <div className="text-[11px] text-slate-400">Comprehensive accidental & damage coverage</div>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-500">997133</td>
                  <td className="p-3 text-right font-mono font-bold">₹{invoice.insuranceAmount.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tax Calculation Breakdown */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Taxable Subtotal:</span>
              <span className="font-mono">₹{invoice.baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>CGST (9%):</span>
              <span className="font-mono">₹{invoice.cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>SGST (9%):</span>
              <span className="font-mono">₹{invoice.sgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="font-mono text-indigo-600">₹{invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            🖨️ Print / Download PDF Receipt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
