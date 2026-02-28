import { useState } from "react";

const Home = () => {
  const [clientData, setClientData] = useState({
    date: "",
    invoice: "",
    name: "",
    address: "",
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

    const handleClientChange = (e) => {
    //   console.log("e-->", e)
    setClientData({ ...clientData, [e.target.name]: e.target.value });
    };
    
    // console.log("item-->", items)

    const handleItemChange = (index, e) => {
    //   console.log("e-->123", e)
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;

    if (e.target.name === "quantity" || e.target.name === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const fullInvoice = { ...clientData, items };

    const existingData = JSON.parse(localStorage.getItem("invoices") || "[]");
    localStorage.setItem(
      "invoices",
      JSON.stringify([...existingData, fullInvoice]),
    );

    alert("Invoice saved successfully!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 bg-gray-50 rounded">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Date:</label>
            <input
              required
              type="date"
              name="date"
              onChange={handleClientChange}
              className="border p-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Invoice No.:</label>
            <input
              required
              type="text"
              name="invoice"
              placeholder="INV-001"
              onChange={handleClientChange}
              className="border p-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Name:</label>
            <input
              required
              type="text"
              name="name"
              placeholder="Client Name"
              onChange={handleClientChange}
              className="border p-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Address:</label>
            <textarea
              required
              name="address"
              rows="2"
              onChange={handleClientChange}
              className="border p-1"
              placeholder="Address..."
            ></textarea>
          </div>
        </div>

        <div className="border p-5 rounded">
          <h3 className="font-bold mb-3">Line Items</h3>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
              <div className="col-span-5">
                <label className="text-xs">Description</label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full border p-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs">Qty</label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full border p-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs">Rate</label>
                <input
                  type="number"
                  name="rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full border p-1"
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs">Amount</label>
                <input
                  type="number"
                  value={item.amount}
                  readOnly
                  className="w-full border p-1 bg-gray-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-blue-600 text-sm font-semibold"
          >
            + Add Item
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Invoice
        </button>
      </form>
    </div>
  );
};

export default Home;
