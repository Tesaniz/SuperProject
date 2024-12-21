"use client";

import { FC } from "react";

interface BalanceProps {
  balance: string;
}

const Balance: FC<BalanceProps> = ({ balance }) => {
  // Преобразуем баланс из WEI в ETH
  const balanceInETH = (BigInt(balance) / BigInt(10 ** 18)).toString();

  return (
    <div className="flex items-center space-x-2 mb-4">
      <p className="text-xl font-semibold text-gray-800">
        Баланс: {parseFloat(balanceInETH).toFixed(6)} ETH
      </p>
    </div>
  );
};

export default Balance;
