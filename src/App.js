import React, { useMemo, useState } from "react";
import "./App.css";

const initialExpenses = [
  { id: 1, date: "2026-03-12", category: "Fuel", amount: 40 },
  { id: 2, date: "2026-03-10", category: "Repair", amount: 120 },
  { id: 3, date: "2026-03-05", category: "Insurance", amount: 95 },
  { id: 4, date: "2026-03-01", category: "Tax", amount: 20 },
];

const categories = ["Fuel", "Repair", "Insurance", "Tax"];

function formatGBP(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value || 0);
}

export default function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Fuel");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [motReminder, setMotReminder] = useState(true);
  const [taxReminder, setTaxReminder] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((item) => item.date.startsWith(currentMonth));
  }, [expenses, currentMonth]);

  const totals = useMemo(() => {
    const summary = {
      total: 0,
      Fuel: 0,
      Repair: 0,
      Insurance: 0,
      Tax: 0,
    };

    for (const item of monthlyExpenses) {
      summary.total += Number(item.amount);
      summary[item.category] += Number(item.amount);
    }

    return summary;
  }, [monthlyExpenses]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0 || !date || !category) return;

    const newExpense = {
      id: Date.now(),
      date,
      category,
      amount: parsedAmount,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setAmount("");
    setCategory("Fuel");
    setDate(new Date().toISOString().split("T")[0]);
    setActiveTab("history");
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
          <button
            className={activeTab === "reminders" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reminders")}
          >
            Reminders
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div>
            <div className="card">
              <h2>Monthly Total</h2>
              <div className="big-number">{formatGBP(totals.total)}</div>
              <p>Total spent this month</p>
            </div>

            <div className="grid">
              {categories.map((item) => (
                <div className="card" key={item}>
                  <h3>{item}</h3>
                  <div className="small-number">{formatGBP(totals[item])}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div className="card">
            <h2>Add Expense</h2>
            <form onSubmit={handleAddExpense} className="form">
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
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

              <button type="submit" className="save-btn">
                Save Expense
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="card">
            <h2>Expense History</h2>
            {sortedExpenses.length === 0 ? (
              <p>No expenses yet.</p>
            ) : (
              sortedExpenses.map((item) => (
                <div className="history-item" key={item.id}>
                  <div>
                    <strong>{item.category}</strong>
                    <div className="date-text">{item.date}</div>
                  </div>
                  <div className="amount-text">{formatGBP(item.amount)}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="card">
            <h2>Reminders</h2>

            <div className="reminder-item">
              <div>
                <strong>MOT Reminder</strong>
                <div className="date-text">Turn on to remember your MOT date</div>
              </div>
              <input
                type="checkbox"
                checked={motReminder}
                onChange={() => setMotReminder(!motReminder)}
              />
            </div>

            <div className="reminder-item">
              <div>
                <strong>Road Tax Reminder</strong>
                <div className="date-text">Turn on to remember your road tax date</div>
              </div>
              <input
                type="checkbox"
                checked={taxReminder}
                onChange={() => setTaxReminder(!taxReminder)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
