import { useState, useEffect } from "react"

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses")
    return saved ? JSON.parse(saved) : []
  })
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [filter, setFilter] = useState("All")
  const [budget, setBudget] = useState(() => {
    return localStorage.getItem("budget") || ""
  })
  const [budgetInput, setBudgetInput] = useState("")

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("budget", budget)
  }, [budget])

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const remaining = budget ? parseFloat(budget) - total : null

  const filteredExpenses = filter === "All"
    ? expenses
    : expenses.filter((exp) => exp.category === filter)

  const addExpense = () => {
    if (!title || !amount) return
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        title,
        amount: parseFloat(amount),
        category,
      },
    ])
    setTitle("")
    setAmount("")
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  const saveBudget = () => {
    if (!budgetInput) return
    setBudget(budgetInput)
    setBudgetInput("")
  }

  const categoryColors = {
    Food: "bg-green-100 text-green-700",
    Transport: "bg-yellow-100 text-yellow-700",
    Shopping: "bg-pink-100 text-pink-700",
    Bills: "bg-red-100 text-red-700",
    Other: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="w-full max-w-xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Expense Tracker
        </h1>

        {/* Budget + Total Card */}
        <div className="bg-blue-600 text-white rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm uppercase tracking-wide">Total Spent</p>
              <p className="text-4xl font-bold mt-1">Rs {total.toFixed(2)}</p>
            </div>
            {budget && (
              <div className="text-right">
                <p className="text-sm uppercase tracking-wide">Remaining</p>
                <p className={`text-2xl font-bold mt-1 ${remaining < 0 ? "text-red-300" : "text-green-300"}`}>
                  Rs {remaining.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Budget Warning */}
          {remaining !== null && remaining < 0 && (
            <div className="mt-3 bg-red-500 rounded-lg p-2 text-center text-sm font-semibold">
              ⚠️ Budget limit exceeded
            </div>
          )}
        </div>

        {/* Set Budget */}
        <div className="bg-white rounded-xl p-5 shadow mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Set Monthly Budget
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter budget (Rs)"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={saveBudget}
              className="bg-blue-600 text-white px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
          {budget && (
            <p className="text-sm text-gray-400 mt-2">
              Current budget: Rs {parseFloat(budget).toFixed(2)}
            </p>
          )}
        </div>

        {/* Add Expense Form */}
        <div className="bg-white rounded-xl p-5 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Add Expense
          </h2>

          <input
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Amount (Rs)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          <button
            onClick={addExpense}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Expense
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          {["All", "Food", "Transport", "Shopping", "Bills", "Other"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Expenses {filter !== "All" && `— ${filter}`}
          </h2>

          {filteredExpenses.length === 0 ? (
            <p className="text-gray-400 text-center">No expenses yet!</p>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex justify-between items-center border-b py-3 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[exp.category]}`}>
                    {exp.category}
                  </span>
                  <p className="font-medium text-gray-800">{exp.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-blue-600">
                    Rs {exp.amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default App