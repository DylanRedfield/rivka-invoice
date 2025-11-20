'use client';

import { useState } from 'react';

interface LineItem {
  paymentMethod: string;
  amount: string;
  details: string;
}

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { paymentMethod: 'bank_transfer', amount: '', details: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addLineItem = () => {
    setLineItems([...lineItems, { paymentMethod: 'bank_transfer', amount: '', details: '' }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

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
          treatmentDate,
          lineItems: lineItems.map(item => ({
            paymentMethod: item.paymentMethod,
            amount: parseFloat(item.amount),
            details: item.details,
          })),
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
      setTreatmentDate(new Date().toISOString().split('T')[0]);
      setLineItems([{ paymentMethod: 'bank_transfer', amount: '', details: '' }]);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">מחולל קבלות</h1>
            <p className="text-gray-600">רבקה תמר קולמן</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right text-gray-900"
                placeholder="הכנס שם לקוח"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="treatmentDate" className="block text-sm font-medium text-gray-700 text-right mb-2">
                תאריך טיפול
              </label>
              <input
                type="date"
                id="treatmentDate"
                value={treatmentDate}
                onChange={(e) => setTreatmentDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right text-gray-900"
                dir="rtl"
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={addLineItem}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  + הוסף פריט
                </button>
                <h3 className="text-lg font-medium text-gray-900">פריטים</h3>
              </div>

              {lineItems.map((item, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      הסר
                    </button>
                    <span className="text-sm font-medium text-gray-600">פריט {index + 1}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                        אמצעי תשלום
                      </label>
                      <select
                        value={item.paymentMethod}
                        onChange={(e) => updateLineItem(index, 'paymentMethod', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right text-gray-900"
                        dir="rtl"
                      >
                        <option value="bank_transfer">העברה בנקאית</option>
                        <option value="cash">מזומן</option>
                        <option value="other">אחר</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                        סכום (₪)
                      </label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateLineItem(index, 'amount', e.target.value)}
                        required
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right text-gray-900"
                        placeholder="הכנס סכום"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                        פירוט
                      </label>
                      <input
                        type="text"
                        value={item.details}
                        onChange={(e) => updateLineItem(index, 'details', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right text-gray-900"
                        placeholder="הכנס פירוט"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
