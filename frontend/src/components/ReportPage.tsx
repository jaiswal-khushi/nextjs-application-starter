import React, { useEffect, useState } from 'react';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  branch: string;
  phone: string;
}

const ReportPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/customers/report')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch customers');
        return res.json();
      })
      .then((data) => setCustomers(data))
      .catch(() => setError('Error loading customer data'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Customer Report</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-1">ID</th>
            <th className="border border-gray-300 px-3 py-1">First Name</th>
            <th className="border border-gray-300 px-3 py-1">Last Name</th>
            <th className="border border-gray-300 px-3 py-1">Street</th>
            <th className="border border-gray-300 px-3 py-1">City</th>
            <th className="border border-gray-300 px-3 py-1">Branch</th>
            <th className="border border-gray-300 px-3 py-1">Phone</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="border border-gray-300 px-3 py-1">{c.id}</td>
              <td className="border border-gray-300 px-3 py-1">{c.firstName}</td>
              <td className="border border-gray-300 px-3 py-1">{c.lastName}</td>
              <td className="border border-gray-300 px-3 py-1">{c.street}</td>
              <td className="border border-gray-300 px-3 py-1">{c.city}</td>
              <td className="border border-gray-300 px-3 py-1">{c.branch}</td>
              <td className="border border-gray-300 px-3 py-1">{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => window.history.back()}
        className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  );
};

export default ReportPage;
