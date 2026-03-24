import { useState } from 'react';
import axios from 'axios';

// Destructure selectedDate from props here
const ExpenseForm = ({ onExpenseAdded, selectedDate }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { 
        description, 
        amount: Number(amount), 
        category, 
        date: selectedDate // Now this variable is properly defined
      };
      
      // Post to the backend
      await axios.post("http://localhost:5000/api/expenses", body);
      
      onExpenseAdded(); 
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  return (
    <form className="expense-form" onSubmit={onSubmitForm}>
      <input 
        type="text" 
        placeholder="Description" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        required 
      />
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        required 
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};

export default ExpenseForm;