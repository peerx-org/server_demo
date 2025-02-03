import { Wallet } from "ethers";
import { encrypt } from "nexujs";

/** Create an new wallet an return encrypted data  **/
export const createWallet = () => {
  const wallet = Wallet.createRandom();

  return {
    privateKey: encrypt(wallet.privateKey),
    address: wallet.address,
    phrase: encrypt(wallet.mnemonic?.phrase),
  };
};
