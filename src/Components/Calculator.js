// src/components/Calculator.js
import React, { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
  const [numberId, setNumberId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/numbers/${numberId}`);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Server error');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Number Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={numberId}
          onChange={(e) => setNumberId(e.target.value)}
          placeholder="Enter number ID"
        />
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <h2>Average: {result.average}</h2>
          <h3>Stored Numbers: {result.storedNumbers.join(', ')}</h3>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Calculator;