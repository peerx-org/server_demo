import { InfuraProvider, parseEther, Wallet } from "ethers";

const projectId = process.env.INFURA_KEY;

/** Transfer native token `EVM` only */
export async function sendEther(
  privateKey: string,
  toAddress: string,
  amountInEther: string
) {
  const provider = new InfuraProvider("sepolia", projectId);

  const wallet = new Wallet(privateKey, provider);

  const gasPrice = await provider.send("eth_gasPrice", []);

  const balance = await provider.getBalance(wallet.address);

  const amountInWei = parseEther(amountInEther);

  // Check if the balance is less than the amount to send
  if (amountInWei > balance) {
    throw new Error("Insufficient balance");
  }

  const tx = {
    to: toAddress,
    value: amountInWei,
    gasLimit: 21000,
    gasPrice: gasPrice,
  };

  try {
    // Send the transaction
    const transaction = await wallet.sendTransaction(tx);

    // Wait for the transaction to be mined (confirmed)
    const receipt = await transaction.wait();
    return {
      message: "success",
      receipt,
      balance: balance - amountInWei,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { message: "failed" };
  }
}
