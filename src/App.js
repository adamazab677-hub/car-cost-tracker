import React, { useMemo, useState } from "react";
import "./App.css";

const categories = ["Fuel", "Repair", "Insurance", "Tax"];

function formatGBP(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value || 0);
}

export default function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 50, category: "Fuel", date: "2026-03-18" },
    { id: 2, amount: 40, category: "Fuel", date: "2026-03-12" },
    { id: 3, amount: 120, category: "Repair", date: "2026-03-10" },
    { id: 4, amount: 95, category: "Insurance", date: "2026-03-05" },
    { id: 5, amount: 20, category: "Tax", date: "2026-03-01" },
  ]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Fuel");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const resetForm = () => {
    setAmount("");
    setCategory("Fuel");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const parsed = Number(amount);

    if (!parsed || parsed <= 0 || !date || !category) return;

    if (editingId !== null) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, amount: parsed, category, date }
            : item
        )
      );
    } else {
      setExpenses((prev) => [
        {
          id: Date.now(),
          amount: parsed,
          category,
          date,
        },
        ...prev,
      ]);
    }

    resetForm();
    setActiveTab("dashboard");
  };

  const handleEdit = (item) => {
    setAmount(String(item.amount));
    setCategory(item.category);
    setDate(item.date);
    setEditingId(item.id);
    setActiveTab("add");
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const renderExpenseList = () => {
    if (sortedExpenses.length === 0) {
      return <p>No expenses yet.</p>;
    }

    return sortedExpenses.map((item) => (
      <div key={item.id} className="history-item">
        <div>
          <strong>{item.category}</strong>
          <div className="date-text">{item.date}</div>
        </div>

        <div className="history-right">
          <div className="amount-text">{formatGBP(item.amount)}</div>
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => handleEdit(item)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Car Cost Tracker UK</h1>
        <p className="subtitle">Simple MVP to track monthly car spending</p>

        <div className="tabs">
          <button
            className={activeTab === "dashboard" ? "tab active" : "tab"}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activeTab === "add" ? "tab active" : "tab"}
            onClick={() => setActiveTab("add")}
          >
            Add Expense
          </button>

          <button
            className={activeTab === "history" ? "tab active" : "tab"}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="card">
              <h2>Total</h2>
              <div className="big-number">{formatGBP(total)}</div>
            </div>

            <div className="card">
              <h2>All Expenses</h2>
              {renderExpenseList()}
            </div>
          </>
        )}

        {activeTab === "add" && (
          <div className="card">
            <h2>{editingId !== null ? "Edit Expense" : "Add Expense"}</h2>

            <form onSubmit={handleAddOrUpdate} className="form">
              <label>Amount (£)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button type="submit" className="save-btn">
                {editingId !== null ? "Update Expense" : "Add Expense"}
              </button>

              {editingId !== null && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="card">
            <h2>Expense History</h2>
            {renderExpenseList()}
          </div>
        )}
      </div>
    </div>
  );
}