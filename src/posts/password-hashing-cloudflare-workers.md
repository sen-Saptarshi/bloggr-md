---
title: "Password Hashing and Verification in Cloudflare Workers"
date: "2025-01-10"
author: "Saptarshi Sen"
tags: ["Workers", "Password", "Cloudflare", "Hono", "Hashing"]
description: "How to hash and verify passwords using the Cloudflare Web Crypto API in Cloudflare Workers. Where libraries like bcrypt and argon2 are not available."
---

To hash and compare passwords using the Cloudflare Web Crypto API, you can utilize the `crypto.subtle` methods available in Cloudflare Workers. Below is a detailed guide on how to implement password hashing and verification.

## Hashing Passwords

### Step 1: Hashing Function

You can create a function that hashes a password using PBKDF2 with SHA-256. This function will generate a salt if one is not provided and return the salt along with the hashed password.

```javascript
export async function hashPassword(password, providedSalt) {
  const encoder = new TextEncoder();
  const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const hashBuffer = new Uint8Array(exportedKey);

  const hashHex = Array.from(hashBuffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}
```

### Step 2: Verifying Passwords

To verify a password against a stored hash, you will need to split the stored hash into its salt and hash components, then re-hash the provided password attempt with the same salt and compare the results.

```javascript
export async function verifyPassword(storedHash, passwordAttempt) {
  const [saltHex, originalHash] = storedHash.split(":");
  const matchResult = saltHex.match(/.{1,2}/g);

  if (!matchResult) {
    throw new Error("Invalid salt format");
  }

  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  const attemptHashWithSalt = await hashPassword(passwordAttempt, salt);
  const [, attemptHash] = attemptHashWithSalt.split(":");

  return attemptHash === originalHash;
}
```

## Usage Example

Here’s how you might use these functions in your application:

```javascript
async function registerUser(password) {
  const hashedPassword = await hashPassword(password);
  // Store hashedPassword in your database
}

async function loginUser(storedHash, passwordAttempt) {
  const isValid = await verifyPassword(storedHash, passwordAttempt);
  if (isValid) {
    // Grant access
  } else {
    // Deny access
  }
}
```

## Considerations

- **Performance**: Cloudflare Workers have limitations on CPU time; ensure that your hashing operations are efficient and consider offloading heavy computations to external services if necessary[4].
- **Security**: Use strong iterations (100,000 in this case) for PBKDF2 to enhance security against brute-force attacks[1].
- **Storage**: Store only the hashed passwords along with their salts in your database to ensure security.

Citations:
[1] https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html
[2] https://dev.to/charca/password-protection-for-cloudflare-pages-8ma
[3] https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/
[4] https://community.cloudflare.com/t/options-for-password-hashing/138077
[5] https://stackoverflow.com/questions/68141513/how-to-create-a-hash-using-web-crypto-api
[6] https://github.com/cloudflare/cloudflare-docs/issues/11293
[7] https://community.cloudflare.com/t/long-running-webcrypto-api/90953?page=2
[8] https://community.cloudflare.com/t/options-for-password-hashing/138077/14
