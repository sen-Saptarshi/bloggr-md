---
title: "How Crypto Wallets Actually Work 🔐"
date: "2025-06-29"
author: "Saptarshi Sen"
tags: ["Blockchain", "Cryptography", "Wallets", "Web3", "Security"]
description: "Dive deep into how crypto wallets generate public-private key pairs, the role of encryption algorithms like ECDSA and EdDSA, and what are HD wallets ."
---
How Wallet actually works??

We can create multiple wallets using the same `seed phrase`.

We generate the `public key` and `private key` of our own
to do **transaction in the blockchain**.

So make sure the `private key` generated is actually private. Better use open source wallets.

The question is how the wallet generates the `public key` and `private key`?

### Encryption

- Symmetric encryption: encryption + decryption using same key
  e.g `AES` [tool](https://emn178.github.io/online-tools/aes/encrypt/)
- Asymmetric encryption:
  encryption + decryption using different keys
  encryption with public key, decryption with private key
  e.g `RSA`

### Common Asymmetric Encryption Algorithms

`RSA` - Rivest-Shamir-Adleman

`ECC` - Elliptic Curve Cryptography (`ECDSA`) - ETH and BTC

`EdDSA` - Edwards-curve Digital Signature Algorithm - SOL

`Elliptic Curve Cryptography`:

`y^2 = x^3 + ax + b` type of equation

- secp256k1 - `y^2 = x^3 + 7` - used in BTC and ETH
- ed25519 - `-x^2 + y^2 = 1 + dx^2 y^2` - used in SOL

## Creating a private/public key pair and using them

TODO:

1. Create a public—private keypair
2. Define a message to sign
3. Convert messase to UInt8Array
4. Sign message using private key
5. Verify message using public key

- For EdDSA - ed25519
  `@noble/ed25519` or `@solana/web3.js`

- For ECDSA - secp256k1
  `@noble/secp256k1` or `ethers`

### using `@noble/ed25519`

step by step:

```js
import * as ed from "@noble/ed25519";

async function main() {
  // Generate the private and public keys
  const privKey = ed.utils.randomPrivateKey();
  const pubKey = await ed.getPublicKeyAsync(privKey);
  //the message
  const message = new TextEncoder().encode("Hello Peeps!");
  //Sign the message
  const signature = await ed.signAsync(message, privKey);
  //Verify the signature
  const isValid = await ed.verifyAsync(signature, message, pubKey);

  console.log(`Private Key: ${btoa(privKey)}`);
  console.log(`Public Key: ${btoa(pubKey)}`);
  console.log(`Message: ${new TextDecoder().decode(message)}`);
  console.log(`Signature: ${btoa(signature)}`);
  console.log(`Is Valid: ${isValid}`);
}

main();
```

Miners verify the signature using `message` and `pubKey`

For a transaction the `message` is like:

The sender (`<fromAddress>`) sends `<amount>` of coin to the recipient (`<toAddress>`)

### using `@solana/web3.js`

Different blockchains have their own wrapper of `@noble/ed25519`

```js
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

// Generate a new keypair
const keypair = Keypair.generate();

// Extract the public and private keys
const publicKey = keypair.publicKey.toString();
const secretKey = keypair.secretKey;

// Display the keys
console.log("Public Key:", publicKey);
console.log("Private Key (Secret Key):", secretKey);

// Convert the message "hello world" to a Uint8Array
const message = new TextEncoder().encode("hello world");

const signature = nacl.sign.detached(message, secretKey);
const result = nacl.sign.detached.verify(
  message,
  signature,
  keypair.publicKey.toBytes()
);

console.log(result);
```

one thing to notice here is that the last 32 bytes of `secretKey` is the `public key`

### Now `ECDSA`

### using `@noble/secp256k1`

```js
import * as secp from "@noble/secp256k1";

async function main() {
  const privKey = secp.utils.randomPrivateKey(); // Secure random private key
  // sha256 of 'hello world'
  const msgHash =
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
  const pubKey = secp.getPublicKey(privKey);
  const signature = await secp.signAsync(msgHash, privKey); // Sync methods below
  const isValid = secp.verify(signature, msgHash, pubKey);
  console.log(isValid);
}

main();
```

### using `ethers`

```js
import { ethers } from "ethers";

// Generate a random wallet
const wallet = ethers.Wallet.createRandom();

// Extract the public and private keys
const publicKey = wallet.address;
const privateKey = wallet.privateKey;

console.log("Public Key (Address):", publicKey);
console.log("Private Key:", privateKey);

// Message to sign
const message = "hello world";

// Sign the message using the wallet's private key
const signature = await wallet.signMessage(message);
console.log("Signature:", signature);

// Verify the signature
const recoveredAddress = ethers.verifyMessage(message, signature);

console.log("Recovered Address:", recoveredAddress);
console.log("Signature is valid:", recoveredAddress === publicKey);
```

## Hierarchical Deterministic Wallets (HD Wallets)

- Problem: It's hard to maintain multiple wallets (public-private key pairs)

- solution:
  Single seed phase can be used to generate multiple wallets (public-private key pairs)
  This is deterministic also. Given the same seed, the same wallet is generated.
  - BIP-32 (Bitcoin Improvement Proposal 32, 2012):
    To make it easier to recover the wallet.

## Mnemonic

BIP-39 (Bitcoin Improvement Proposal 39, 2013)
was introduced to tell how to use the pnemonic to recover the wallet.

[word-list](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt)

```js
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

// Generate a 12-word mnemonic
const mnemonic = generateMnemonic(256);
// const mnemonic =
//   "tuition marble attack minute cement desert couch grocery session decide risk stove";
console.log(mnemonic);

const seed = mnemonicToSeedSync(mnemonic);
console.log(seed.toString("hex"));
```

the seed is the `master seed` or `root seed`

## Derivation Path

Specifies a systematic way to derive various keys from a master key

The derivation path `m/44'/60'/0'/0/0` is a standard used in HD wallets for generating addresses. Here's a breakdown:

1. `m` - Represents the master node (root of the tree).
2. `44'` - This is the purpose, following BIP-44, which is a multi-account hierarchy for deterministic wallets.
3. `60'` - Represents the coin type, where 60 is the registered index for Ethereum.
   `501'` for solana, `0'` for bitcoin
4. `0'` - Account index, allowing for multiple accounts.
5. `0` - Chain, where `0` is typically for external chain (receiving addresses).
6. `0` - Address index, which increments for each new address.

This structure allows the deterministic generation of multiple accounts and addresses from a single seed phrase.

```js
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

// const mnemonic = generateMnemonic();
const mnemonic =
  "episode truly drill crawl exact glass join scrap cover give avocado seven";
const seed = mnemonicToSeedSync(mnemonic);
for (let i = 0; i < 4; i++) {
  const path = `m/44'/60'/${i}'/0'`; // This is the derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log("secret:", btoa(secret));
  console.log("public:", Keypair.fromSecretKey(secret).publicKey.toBase58());
}
```

Look How it is generating the same secret and public key `deterministic`-ally

So that's it upto HD wallets.
Now we can try to make our own crypto wallet - if not a chrome extension, atleast a website.
If not a fully functional wallet connected to a blockchain, atleast a Wallet Key pair generator.

---

### adhoc info
Algorithm Used in Ethereum: `ECDSA` - sepk256k1 curve, `SHA256`

`Keccak256`: Very similar to the `sha256` algorithm, output 256-bit hash value, pre-image resistant.
[try-out](https://emn178.github.io/online-tools/keccak_256.html)

Generating public key in ETH:

1. a public key generated using the elliptic curve cryptography
2. the public key is then hashed using `Keccak-256`
3. we get a 32-byte hash.
4. ETH address is derived from last 20 bytes of the hash output
5. Final address: `'0x' + '{hex of the last 20 bytes}' `

BIP - [Bitcoin Improvement Proposal](https://github.com/bitcoin/bips)

