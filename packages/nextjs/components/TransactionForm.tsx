"use client";

import { FC } from "react";

interface TransactionFormProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const TransactionForm: FC<TransactionFormProps> = ({ amount, onAmountChange }) => (
  <div className="mb-4">
    <label htmlFor="amount" className="block text-gray-700">Сумма</label>
    <input
      type="number"
      id="amount"
      value={amount}
      onChange={(e) => onAmountChange(e.target.value)}
      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Введите сумму"
    />
  </div>
);

export default TransactionForm;
