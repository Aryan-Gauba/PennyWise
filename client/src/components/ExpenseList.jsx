import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ExpenseList = ({ expenses, setExpenses }) => {
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Calculate total for the currently viewed date
  const dayTotal = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <>
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p>No expenses found for this date.</p>
        </div>
      ) : (
        <ul className="expense-list">
          {expenses.map(expense => (
            <li key={expense.id} className="expense-item">
              <span className="desc">{expense.description}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="cat">{expense.category}</span>
                <span className="amt">₹{Number(expense.amount).toFixed(2)}</span>
                <button onClick={() => deleteExpense(expense.id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {expenses.length > 0 && (
        <div className="list-footer">
          <strong style={{ color: 'var(--text-main)' }}>Total for this Date:</strong>
          <span className="total-amount">₹{dayTotal.toFixed(2)}</span>
        </div>
      )}
    </>
  );
};

export default ExpenseList;