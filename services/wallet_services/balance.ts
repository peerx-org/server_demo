import { ethers, formatEther } from "ethers";
import { Networks, providers, USDT_ADDRESS, usdtABI } from "./token.list";

/** A function used to fetch native token balance `ETH`, `BNB` */
export async function getBalance(walletAddress: string, network: Network) {
  const provider = providers.TESTS_[network];
  const balance = await provider.getBalance(walletAddress);
  return formatEther(balance);
}

type Network = "ETH" | "BSC";

export const getUSDTBalance = async (
  network: Network,
  walletAddress: string
) => {
  try {
    // Validate network choice
    if (!Networks.includes(network)) {
      throw new Error('Invalid network. Choose "ethereum" or "bsc".');
    }

    // Get the provider and USDT contract address for the chosen network
    // TODO: Replace with actual network
    const provider = providers.MAINNET[network];
    const usdtAddress = USDT_ADDRESS[network];

    // Create a contract instance
    const usdtContract = new ethers.Contract(usdtAddress, usdtABI, provider);

    // Get the USDT balance
    const balance = await usdtContract.balanceOf(walletAddress);

    // Get the token decimals (USDT uses 6 decimals)
    const decimals = await usdtContract.decimals();

    // Format the balance to a human-readable number
    const formattedBalance = ethers.formatUnits(balance, decimals);

    // console.log(`USDT Balance on ${network}: ${formattedBalance}`);
    return formattedBalance;
  } catch (error) {
    const errMsg = `Error fetching USDT balance on ${network}:`;
    console.error(errMsg, error);
    throw new Error(errMsg + error);
  }
};

// Fetch balance for `EVM` multichain currency
export const getEvmBalance = async (walletAddress: string) => {
  try {
    const native_eth = await getBalance(walletAddress, "ETH");
    const native_bsc = await getBalance(walletAddress, "BSC");
    const usdt_eth = await getUSDTBalance("ETH", walletAddress);
    const usdt_bsc = await getUSDTBalance("BSC", walletAddress);

    return {
      native_bsc,
      native_eth,
      usdt_bsc,
      usdt_eth,
    };
  } catch (error) {
    throw new Error(`Something went wrong: ${error}`);
  }
};
