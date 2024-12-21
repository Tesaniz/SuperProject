"use client";

import { FC } from "react";

interface GetBalanceProps {
  onGetBalance: () => void;
}

const GetBalance: FC<GetBalanceProps> = ({ onGetBalance }) => (
  <button
    onClick={onGetBalance}
    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
  >
    Обновить баланс
  </button>
);

export default GetBalance;
