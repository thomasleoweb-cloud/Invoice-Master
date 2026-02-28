import { useState, useEffect, useRef, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadPdf = () => {
  const invoiceRef = useRef(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const TAX_RATE = 0.12;

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    setInvoices(savedInvoices);
    if (savedInvoices.length > 0) {
      setCurrentInvoice(savedInvoices[0]);
    }
  }, []);

  const { subtotal, taxAmount, grandTotal } = useMemo(() => {
    if (!currentInvoice || !currentInvoice.items) {
      return { subtotal: 0, taxAmount: 0, grandTotal: 0 };
    }
    const sub = currentInvoice.items.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const tax = sub * TAX_RATE;
    return { subtotal: sub, taxAmount: tax, grandTotal: sub + tax };
  }, [currentInvoice]);

  const handleSelectInvoice = (e) => {
    const index = parseInt(e.target.value);
    setSelectedIndex(index);
    setCurrentInvoice(invoices[index]);
  };

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      const noPrintElements = document.querySelectorAll(".no-print");
      noPrintElements.forEach((el) => (el.style.opacity = "0"));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        ignoreElements: (el) => el.classList.contains("no-print"),
      });

      noPrintElements.forEach((el) => (el.style.opacity = "1"));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${currentInvoice?.invoice || "001"}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert(
        "PDF Error: Please check console. Modern CSS colors (oklch) might be causing issues.",
      );
    }
  };

  if (!currentInvoice)
    return <div className="p-10 text-center">No invoices found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-6 bg-white border sm:mt-10 mb-10 min-w-0">
      <div className="no-print mb-6 bg-[#f3f4f6] p-4 rounded flex flex-col sm:flex-row gap-4 justify-between items-center border border-[#e5e7eb]">
        <div className="w-full sm:w-auto">
          <label className="block sm:inline mr-2 font-bold text-sm mb-1">
            Select Invoice:
          </label>
          <select
            value={selectedIndex}
            onChange={handleSelectInvoice}
            className="w-full sm:w-auto border p-2 text-sm rounded bg-white outline-none"
          >
            {invoices.map((inv, i) => (
              <option key={i} value={i}>
                Inv: {inv.invoice} - {inv.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={downloadPDF}
          className="w-full sm:w-auto bg-[#dc2626] text-white px-6 py-2 rounded font-bold hover:bg-[#b91c1c]"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={invoiceRef}
        style={{ backgroundColor: "#ffffff" }}
        className="p-4 sm:p-10 border border-[#cccccc] w-full mx-auto box-border overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row justify-between border-b-2 border-black pb-5 gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              INVOICE
            </h1>
            <p className="mt-4 font-bold text-lg sm:text-xl text-black wrap-break-words">
              {currentInvoice.name}
            </p>
            <p className="text-[#4b5563] text-sm whitespace-pre-wrap wrap-break-words">
              {currentInvoice.address}
            </p>
          </div>
          <div className="text-left sm:text-right text-black shrink-0">
            <p className="text-sm">
              <strong>Date:</strong> {currentInvoice.date}
            </p>
            <p className="text-sm">
              <strong>Inv #:</strong> {currentInvoice.invoice}
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto mt-6 sm:mt-10">
          <table className="w-full border-collapse min-w-450px">
            <thead>
              <tr
                style={{ backgroundColor: "#111827" }}
                className="text-white text-xs sm:text-sm"
              >
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center w-16 sm:w-20">Qty</th>
                <th className="p-3 text-right w-24 sm:w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice.items?.map((item, i) => (
                <tr key={i} className="border-b border-[#eeeeee] text-sm">
                  <td className="p-3 text-[#374151] wrap-break-words">
                    {item.description}
                  </td>
                  <td className="p-3 text-center text-[#374151]">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right font-bold text-black whitespace-nowrap">
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full sm:w-64 space-y-2 border-t-2 border-black pt-4">
            <div className="flex justify-between text-sm text-[#4b5563]">
              <span>Subtotal:</span>
              <span className="font-bold text-black">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#4b5563] border-b border-[#eeeeee] pb-2">
              <span>GST (12%):</span>
              <span className="font-bold text-black">
                ₹{taxAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-bold text-[#1e3a8a] pt-2">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPdf;
