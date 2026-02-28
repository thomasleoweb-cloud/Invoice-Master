import { useState, useEffect } from "react";

const Invoice = () => {
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

  // console.log('invoice:-', invoices)

  const handleHeaderChange = (e) => {
    setCurrentInvoice({ ...currentInvoice, [e.target.name]: e.target.value });
  };

  const handleItemEdit = (index, field, value) => {
    const updatedItems = [...currentInvoice.items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount =
        updatedItems[index].quantity * updatedItems[index].rate;
    }

    setCurrentInvoice({ ...currentInvoice, items: updatedItems });
  };

  const deleteItem = (index) => {
    const updatedItems = currentInvoice.items.filter((_, i) => i !== index);
    setCurrentInvoice({ ...currentInvoice, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return (
      currentInvoice?.items.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      ) || 0
    );
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * TAX_RATE;
  const grandTotal = subtotal + taxAmount;

  const saveChanges = () => {
    const updatedAllInvoices = [...invoices];
    updatedAllInvoices[selectedIndex] = currentInvoice;
    localStorage.setItem("invoices", JSON.stringify(updatedAllInvoices));
    setInvoices(updatedAllInvoices);
    alert("Invoice Updated!");
  };

  if (!currentInvoice)
    return <div className="p-10 text-center">No invoices found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg border mt-4 sm:mt-10 mb-10 rounded-sm font-sans min-w-0">
      <div className="print:hidden mb-6 bg-gray-100 p-3 no-print">
        <label className="block sm:inline mr-2 font-bold text-sm mb-1">
          Select Invoice:
        </label>
        <select
          onChange={(e) => {
            setSelectedIndex(e.target.value);
            setCurrentInvoice(invoices[e.target.value]);
          }}
          className="border p-1 text-sm w-full sm:w-auto"
        >
          {invoices.map((inv, i) => (
            <option key={i} value={i}>
              Inv: {inv.invoice} - {inv.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between border-b-2 border-gray-800 pb-5 gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            INVOICE
          </h1>
          <div className="mt-4">
            <p className="text-xs uppercase font-bold text-gray-500">
              Bill To:
            </p>
            <p className="font-bold text-lg truncate">{currentInvoice.name}</p>
            <p className="text-sm text-gray-600 wrap-break-words max-w-xs">
              {currentInvoice.address}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm font-bold whitespace-nowrap">
              Invoice #:
            </label>
            <input
              name="invoice"
              value={currentInvoice.invoice}
              onChange={handleHeaderChange}
              className="border-b w-full sm:w-24 text-left sm:text-right outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm font-bold whitespace-nowrap">
              Date:
            </label>
            <input
              type="date"
              name="date"
              value={currentInvoice.date}
              onChange={handleHeaderChange}
              className="border-b w-full sm:w-32 text-left sm:text-right outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto mt-8 -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full border-collapse min-w-500px">
          <thead>
            <tr className="bg-gray-800 text-white text-xs uppercase">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-center w-16">Qty</th>
              <th className="p-2 text-center w-20">Rate</th>
              <th className="p-2 text-right w-24">Amount</th>
              <th className="print:hidden p-2 text-center w-16 no-print">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentInvoice.items.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-2">
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemEdit(index, "description", e.target.value)
                    }
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemEdit(index, "quantity", e.target.value)
                    }
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemEdit(index, "rate", e.target.value)
                    }
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="p-2 text-right font-medium whitespace-nowrap">
                  ₹{Number(item.amount).toFixed(2)}
                </td>
                <td className="print:hidden p-2 text-center no-print">
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-full sm:w-64 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm px-1">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm border-b pb-2 px-1">
            <span className="italic text-gray-500 text-xs">GST (12%):</span>
            <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold text-black pt-2 px-1">
            <span>Grand Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 no-print print:hidden">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-bold hover:bg-gray-700 order-1 sm:order-2"
        >
          Print / PDF
        </button>
        <button
          onClick={saveChanges}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-bold hover:bg-green-700 order-2 sm:order-1"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Invoice;
