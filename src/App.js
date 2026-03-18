sortedExpenses.map((item) => (
  <div className="history-item" key={item.id}>
    <div>
      <strong>{item.category}</strong>
      <div>{item.date}</div>
    </div>

    <div>
      <div>£{item.amount}</div>

      <button onClick={() => handleEdit(item)} className="edit-btn">
        Edit
      </button>

      <button onClick={() => handleDelete(item.id)} className="delete-btn">
        Delete
      </button>
    </div>
  </div>
))
