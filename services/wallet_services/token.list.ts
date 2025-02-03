import { ethers } from "ethers";

export enum USDT_ADDRESS {
  ETH = "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Ethereum USDT
  BSC = "0x55d398326f99059fF775485246999027B3197955", // BSC USDT
}

export enum TOKEN {
  USDT_BSC,
  BNB,
  ETH,
  USDT_ETH,
}

export const usdtABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const projectId = process.env.INFURA_KEY;

export const providers = {
  TESTS_: {
    ETH: new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${projectId}`
    ),
    BSC: new ethers.JsonRpcProvider(
      `https://bsc-testnet.infura.io/v3/${projectId}`
    ),
  },
  MAINNET: {
    ETH: new ethers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${projectId}`
    ),
    BSC: new ethers.JsonRpcProvider(
      `https://bsc-mainnet.infura.io/v3/${projectId}`
    ),
  },
};

export const Networks = ["ETH", "BSC"];
