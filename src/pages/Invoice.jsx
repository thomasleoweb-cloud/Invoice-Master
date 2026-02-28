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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg border mt-10 mb-10 rounded-sm font-sans">
      <div className="print:hidden mb-6 bg-gray-100 p-3 no-print">
        <label className="mr-2 font-bold text-sm">Select Invoice:</label>
        <select
          onChange={(e) => {
            setSelectedIndex(e.target.value);
            setCurrentInvoice(invoices[e.target.value]);
          }}
          className="border p-1 text-sm"
        >
          {invoices.map((inv, i) => (
            <option key={i} value={i}>
              Inv: {inv.invoice} - {inv.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between border-b-2 border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            INVOICE
          </h1>
          <div className="mt-4">
            <p className="text-xs uppercase font-bold">
              Bill To:
            </p>
            <p className="font-bold text-lg">{currentInvoice.name}</p>
            <p className="text-sm w-48">
              {currentInvoice.address}
            </p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center justify-end gap-2">
            <label className="text-sm font-bold">
              Invoice #:
            </label>
            <input
              name="invoice"
              value={currentInvoice.invoice}
              onChange={handleHeaderChange}
              className="border-b w-24 text-right outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <label className="text-sm font-bold">Date:</label>
            <input
              type="date"
              name="date"
              value={currentInvoice.date}
              onChange={handleHeaderChange}
              className="border-b w-32 text-right outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <table className="w-full mt-8 border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white text-sm uppercase">
            <th className="p-2 text-left w-1/2">Description</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-center">Rate</th>
            <th className="p-2 text-right">Amount</th>
            <th className="print:hidden p-2 text-center no-print">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoice.items.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <input
                  value={item.description}
                  onChange={(e) =>
                    handleItemEdit(index, "description", e.target.value)
                  }
                  className="w-full bg-transparent outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemEdit(index, "quantity", e.target.value)
                  }
                  className="w-16 text-center bg-transparent outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemEdit(index, "rate", e.target.value)
                  }
                  className="w-20 text-center bg-transparent outline-none"
                />
              </td>
              <td className="p-2 text-right font-medium">
                &#8377;{Number(item.amount).toFixed(2)}
              </td>
              <td className="print:hidden p-2 text-center no-print">
                <button
                  onClick={() => deleteItem(index)}
                  className="bg-red-500 px-2 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="">Subtotal:</span>
            <span className="font-semibold">&#8377;{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm border-b pb-2">
            <span className="font-italic">GST (12%):</span>
            <span className="font-semibold">&#8377;{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-black pt-2">
            <span>Grand Total:</span>
            <span>&#8377;{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-4 no-print print:hidden">
        <button
          onClick={saveChanges}
          className="px-6 py-2 bg-green-600 text-white font-bold hover:bg-green-700"
        >
          Save Changes
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-gray-600 text-white font-bold hover:bg-gray-700"
        >
          Print / PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
