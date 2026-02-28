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
      0
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
        ignoreElements: (el) => el.classList.contains('no-print')
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
      alert("PDF Error: Please check console. Modern CSS colors (oklch) might be causing issues.");
    }
  };

  if (!currentInvoice) return <div className="p-10 text-center">No invoices found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border mt-10 mb-10">
      
      <div className="no-print mb-6 bg-[#f3f4f6] p-4 rounded flex justify-between items-center border border-[#e5e7eb]">
        <div>
          <label className="mr-2 font-bold text-sm">Select Invoice:</label>
          <select
            value={selectedIndex}
            onChange={handleSelectInvoice}
            className="border p-2 text-sm rounded bg-white"
          >
            {invoices.map((inv, i) => (
              <option key={i} value={i}>Inv: {inv.invoice} - {inv.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={downloadPDF}
          className="bg-[#dc2626] text-white px-6 py-2 rounded font-bold hover:bg-[#b91c1c]"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={invoiceRef}
        style={{ backgroundColor: '#ffffff' }}
        className="p-10 border border-[#cccccc] max-w-800px mx-auto"
      >
        <div className="flex justify-between border-b-2 border-black pb-5">
          <div>
            <h1 className="text-4xl font-bold text-black">INVOICE</h1>
            <p className="mt-4 font-bold text-xl text-black">{currentInvoice.name}</p>
            <p className="text-[#4b5563] text-sm whitespace-pre-wrap">{currentInvoice.address}</p>
          </div>
          <div className="text-right text-black">
            <p className="text-sm"><strong>Date:</strong> {currentInvoice.date}</p>
            <p className="text-sm"><strong>Inv #:</strong> {currentInvoice.invoice}</p>
          </div>
        </div>

        <table className="w-full mt-10 border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#111827' }} className="text-white">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoice.items?.map((item, i) => (
              <tr key={i} className="border-b border-[#eeeeee]">
                <td className="p-3 text-[#374151]">{item.description}</td>
                <td className="p-3 text-center text-[#374151]">{item.quantity}</td>
                <td className="p-3 text-right font-bold text-black">&#8377;{Number(item.amount).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-10">
          <div className="w-64 space-y-2 border-t-2 border-black pt-4">
            <div className="flex justify-between text-sm text-[#4b5563]">
              <span>Subtotal:</span>
              <span className="font-bold text-black">&#8377;{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-[#4b5563] border-b border-[#eeeeee] pb-2">
              <span>GST (12%):</span>
              <span className="font-bold text-black">&#8377;{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#1e3a8a] pt-2">
              <span>Grand Total:</span>
              <span>&#8377;{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPdf;