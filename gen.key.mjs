import forge from "node-forge";

const key = forge.pki.rsa.generateKeyPair({ bits: 4096 });
const publicKey = forge.pki.publicKeyFromPem(key.publicKey);
const privateKey = forge.pki.publicKeyFromPem(key.privateKey);

console.log({ publicKey, privateKey });
