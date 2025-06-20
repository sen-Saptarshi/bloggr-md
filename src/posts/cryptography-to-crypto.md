---
title: "Cryptography to Crypto 🦊"
date: "2025-06-20"
author: "Saptarshi Sen"
tags: ["Web3", "Blockchain", "Crypto", "Wallet", "Cryptography"]
description: "A quick exploration of Cryptography and its role in securing digital communications and transactions. How blockchains do auth."
---

# `"not your keys not your crypto"`

[Link](https://projects.100xdevs.com/tracks/public-private-keys/Public-Key-Cryptography-1)

### How do blockchains do auth?

- `asymmetric cryptography`

  use pub key to know somebody's transaction

- use private key to sign transactions

### Bits and bytes

- 0s and 1s
- _everything_ converted to 0s and 1s

### Represent data in binary - bits and bytes

bits

```js
const x = 0; // 0 or 1
console.log(x);
```

bytes - 8 bits
value - (0 - 255)

if any number (0-255) we can assume it to be a byte

```js
const x = 202; // 0 to 255
console.log(x);
```

**Array of bytes**

using `Uint8Array()` over native array bcoz-

- it is space efficient
- it is between 0 and 255 e.g. 3030 -> 214 (3030 % 256)

```js
let bytes = new Uint8Array([0, 3030, 127, 128]);
console.log(bytes);
```

### Encoding

1. `ASCII`
2. `Base58`
3. `Base64`
4. `Hex`
5. `Binary`

### Convert a bytes array to string

```js
const bytes = new Uint8Array([72, 101, 108, 108, 111]);
const string = new TextDecoder().decode(bytes);
console.log(string);
```

### Convert a string to bytes array

```js
const s = "Hello";
const bytes = new TextEncoder().encode(s);
//const bytes = new Uint8Array([...s].map(c => c.charCodeAt(0)))
console.log(bytes);
```

But if we dont want the special characters -

Another way - `Base64` (that we use in crypto)

### `Hex` conversions

1 character = 4 bits

hex = 16 = 2^4

```js
function bytesToHex(bytesArray) {
  return Array.from(bytesArray, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function hexToBytes(hexString) {
  return new Uint8Array(
    hexString.match(/../g).map((byte) => parseInt(byte, 16))
  );
}
```

### `Base64` conversions

1 character = 6 bits

base64 = 64 = 2^6

64 characters (`A-Z`, `a-z`, `0-9`, `+`, `/`)

```js
function bytesToBase64(bytesArray) {
  // const base64String = Buffer.from(bytesArray).toString("base64");
  const base64String = btoa(bytesToAscii(bytesArray));

  return base64String;
}

function base64ToBytes(base64String) {
  const bytes = atob(base64String);
  return asciiToBytes(bytes);
}
```

### `Base58` conversions

1 character = 11 bits

base58 = 58 = 2^11

58 characters (`A-Z`(except `I`, `O`) , `a-z`(except `l`), `1-9`, `+`, `/`)

```js
import bs58 from "bs58";

function bytesToBase58(bytesArray) {
  return bs58.encode(bytesArray);
}

function base58ToBytes(base58String) {
  return bs58.decode(base58String);
}
```

### `Hashing` & `Encryption`

Hashing : one way conversion into fixed-size string of characters - SHA-256, MD5

Encryption : conversion to unreadable characters using specific algorithms and key.

### `Hashing` example

can't reverse this.

```js
import crypto from "crypto";
function asciiToHash(asciiString) {
  return crypto.createHash("sha256").update(asciiString).digest("hex");
}
```

or maybe use this [sha256-online-tool](https://emn178.github.io/online-tools/sha256.htm)

### `Encryption` example

reversible with some key.

- 2 types

  - `symmetric` : encryption + decryption using same key
  - `asymmetric` : encryption + decryption using different keys

  encrypt with public key, decrypt with private key
  encrypt with private key, decrypt with public key

### Creating a private/public key pair

```js
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});
```

or use this [online tool](https://travistidwell.com/jsencrypt/demo/) or [andersbrownworth](https://andersbrownworth.com/blockchain/public-private-keys/keys)

we can decode the message using `publicKey`

### `Signature`

- `signing` : using private key (`message` + `signature` = `public key`)
- `verifying` : using public key (`message` + `public key` + `signature` = `true/false`)

[signing](https://andersbrownworth.com/blockchain/public-private-keys/signatures)

### `Transactions`

- `sender` : `public key`
- `recipient` : `public key`
- `amount` : `number`
- `signature` : `signature`

[transc](https://andersbrownworth.com/blockchain/public-private-keys/transaction)

### `Blockchain` - `proof of work`

All those transactions are stored in the `blockchain` and those transactions are recorded in the `block` and then we need to find a way to `mine` the `block` and find the `nonce` to make the `block` valid.

[demo](https://andersbrownworth.com/blockchain/public-private-keys/blockchain)
