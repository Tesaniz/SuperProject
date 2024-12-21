import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя
import { SimpleDeposit } from "../typechain-types"; // Импорт типов сгенерированного контракта

/**
 * Скрипт для деплоя смарт-контракта SimpleDeposit.
 * Использует Hardhat Runtime Environment для доступа к необходимым функциям и данным.
 *
 * @param hre Объект среды выполнения Hardhat.
 */
const deploySimpleDeposit: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Извлечение имени учетной записи для деплоя
  const { deployer } = await hre.getNamedAccounts();
  // Получение функции для развертывания контрактов
  const { deploy } = hre.deployments;

  // Развертывание контракта SimpleDeposit
  await deploy("SimpleDeposit", {
    from: deployer, // Учетная запись, которая развертывает контракт
    args: [], // Аргументы конструктора контракта (в данном случае отсутствуют)
    log: true, // Включение логирования процесса развертывания
    autoMine: true, // Автоматическое майнинг транзакции на локальной сети
  });

  // Получение экземпляра развернутого контракта
  const simpleDeposit = await hre.ethers.getContract<SimpleDeposit>("SimpleDeposit", deployer);

  // Вывод информации о балансе развертывающего адреса для проверки
  const deployerBalance = await simpleDeposit.getBalance(deployer);
  console.log(`💰 Deployer's initial balance in contract: ${deployerBalance.toString()}`);
};

// Экспорт функции для использования в командах Hardhat
export default deploySimpleDeposit;

// Присвоение тега для удобного выбора скрипта при выполнении
deploySimpleDeposit.tags = ["SimpleDeposit"];
