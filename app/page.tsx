'use client';

import { useState } from 'react';

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setClientName('');
      setAmount('');
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">מחולל קבלות</h1>
            <p className="text-gray-600">רבקה חנה קולמן</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 text-right mb-2">
                שם לקוח
              </label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                placeholder="הכנס שם לקוח"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 text-right mb-2">
                סכום (₪)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                placeholder="הכנס סכום"
                dir="rtl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'מייצר קבלה...' : 'צור קבלה'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
