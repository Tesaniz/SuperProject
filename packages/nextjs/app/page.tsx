"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import Balance from "../components/Balance"; // Компонент для отображения баланса
import ActionButton from "../components/ActionButton"; // Кнопка для действия
import TransactionForm from "../components/TransactionForm"; // Форма для ввода суммы
import GetBalance from "../components/GetBalance"; // Кнопка для получения баланса

const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Адрес контракта

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Page = () => {
  const { address, isConnected } = useAccount(); // Получаем адрес кошелька
  const publicClient = usePublicClient(); // Для чтения данных контракта
  const { data: walletClient } = useWalletClient(); // Для подписания транзакций

  const [amount, setAmount] = useState<string>(""); // Состояние для суммы
  const [balance, setBalance] = useState<string>("0"); // Состояние для баланса

  // Функция для получения баланса пользователя
  const fetchBalance = async () => {
    if (!publicClient || !address) {
      console.log("Нет подключенного адреса");
      return;
    }

    try {
      const userBalance = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getBalance",
        args: [address], // Передаем адрес для получения баланса
      });
      console.log("Баланс пользователя:", userBalance.toString());
      setBalance(userBalance.toString()); // Обновляем состояние баланса
    } catch (error) {
      console.error("Ошибка получения баланса:", error);
      alert("Не удалось получить баланс.");
    }
  };

  // Функция для депозита средств
  const handleDeposit = async () => {
    if (!walletClient || !amount) return;

    try {
      // Отправка транзакции
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "deposit",
        overrides: {
          value: BigInt(amount), // Указываем сумму депозита (в Wei)
        },
      });

      // Ожидание подтверждения транзакции с использованием tx.hash
      const receipt = await publicClient.waitForTransactionReceipt(tx.hash);
      console.log("Транзакция подтверждена:", receipt);

      alert("Депозит успешно выполнен!");
      setAmount(""); // Очищаем поле ввода
      fetchBalance(); // Обновляем баланс
    } catch (error) {
      console.error("Ошибка депозита:", error);
      alert("Не удалось выполнить депозит.");
    }
  };

  // Функция для снятия средств
  const handleWithdraw = async () => {
    if (!walletClient || !amount) return;

    try {
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "withdraw",
        args: [BigInt(amount)], // Указываем сумму для снятия (в Wei)
      });

      // Ожидание подтверждения транзакции с использованием tx.hash
      const receipt = await publicClient.waitForTransactionReceipt(tx.hash);
      console.log("Транзакция подтверждена:", receipt);

      alert("Снятие средств успешно выполнено!");
      setAmount(""); // Очищаем поле ввода
      fetchBalance(); // Обновляем баланс
    } catch (error) {
      console.error("Ошибка снятия средств:", error);
      alert("Не удалось выполнить снятие средств.");
    }
  };

  // Используем useEffect для получения баланса при подключении кошелька
  useEffect(() => {
    if (address) {
      fetchBalance(); // Получаем баланс при подключении
    }
  }, [address]); // Зависимость от адреса

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Simple Deposit</h1>

      {isConnected ? (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          {/* Отображаем текущий баланс */}
          <Balance balance={balance} />

          {/* Кнопка для получения баланса */}
          <GetBalance onGetBalance={fetchBalance} />

          {/* Форма для ввода суммы */}
          <TransactionForm amount={amount} onAmountChange={setAmount} />

          <div className="flex gap-4">
            {/* Кнопки для депозита и снятия */}
            <ActionButton label="Депозит" onClick={handleDeposit} color="bg-green-500" />
            <ActionButton label="Снять" onClick={handleWithdraw} color="bg-blue-500" />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Подключите ваш кошелек, чтобы взаимодействовать с контрактом.</p>
      )}
    </div>
  );
};

export default Page;
