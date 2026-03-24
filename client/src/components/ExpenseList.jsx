import axios from 'axios';

const ExpenseList = ({ expenses, setExpenses }) => {
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Calculate total for the currently viewed date
  const dayTotal = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className="expense-list-container">
      <ul className="expense-list">
        {expenses.map(expense => (
          <li key={expense.id} className="expense-item">
            <span className="desc">{expense.description}</span>
            <span className="cat">{expense.category}</span>
            <span className="amt">₹{Number(expense.amount).toFixed(2)}</span>
            <button onClick={() => deleteExpense(expense.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      {expenses.length > 0 && (
        <div className="list-footer">
          <strong>Total for this Date:</strong>
          <span className="total-amount">₹{dayTotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;