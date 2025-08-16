// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ContentFactoryModule", (m) => {
  const defaultPlatformWallet = "0x14bF1b01930734F2eC1C7c738d1ab309632af30e";
  const platformWallet = m.getParameter("platformWallet", process.env.PLATFORM_WALLET || defaultPlatformWallet);

  // 部署 ContentFactory 合约
  const contentFactory = m.contract("ContentFactory", [platformWallet]);
  return { 
    contentFactory,
    platformWallet 
  };
});