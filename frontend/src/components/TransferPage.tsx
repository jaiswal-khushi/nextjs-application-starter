import React, { useState } from 'react';

const TransferPage: React.FC = () => {
  const [sourceAccount, setSourceAccount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [sourceBalance, setSourceBalance] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const findSourceAccount = async () => {
    setMessage('');
    setSourceBalance(null);
    if (!sourceAccount) return;
    try {
      const res = await fetch(`/api/transfer/account/${sourceAccount}`);
      if (res.ok) {
        const data = await res.json();
        setSourceBalance(data.balance);
      } else {
        setMessage('Source account not found');
      }
    } catch {
      setMessage('Error fetching source account');
    }
  };

  const handleTransfer = async () => {
    setMessage('');
    if (!sourceAccount || !destinationAccount || !amount) {
      setMessage('Please fill all fields');
      return;
    }
    try {
      const res = await fetch(`/api/transfer?sourceAccountNumber=${sourceAccount}&destinationAccountNumber=${destinationAccount}&amount=${amount}`, {
        method: 'POST',
      });
      const text = await res.text();
      if (res.ok) {
        setMessage('Transfer successful');
        setSourceBalance((prev) => (prev !== null ? prev - parseFloat(amount) : null));
      } else {
        setMessage(text);
      }
    } catch {
      setMessage('Transfer failed');
    }
  };

  const handleCancel = () => {
    setSourceAccount('');
    setDestinationAccount('');
    setAmount('');
    setSourceBalance(null);
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Transfer Money</h2>
      <div className="mb-3">
        <label className="block mb-1">Source Account</label>
        <input
          type="text"
          value={sourceAccount}
          onChange={(e) => setSourceAccount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button onClick={findSourceAccount} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Find
        </button>
        {sourceBalance !== null && (
          <p className="mt-2 font-semibold">Balance: ${sourceBalance.toFixed(2)}</p>
        )}
      </div>
      <div className="mb-3">
        <label className="block mb-1">Destination Account</label>
        <input
          type="text"
          value={destinationAccount}
          onChange={(e) => setDestinationAccount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {message && <p className="mb-3 text-red-600">{message}</p>}
      <div className="flex justify-between">
        <button onClick={handleTransfer} className="bg-green-600 text-white px-4 py-2 rounded">
          Transfer
        </button>
        <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TransferPage;
