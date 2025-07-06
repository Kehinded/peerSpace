import CryptoJS from "crypto-js";
import { Buffer, createCipheriv, createDecipheriv } from "browser-crypto";
// import { parse, stringify } from 'flatted';
// import { logger } from "../services/logger";
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Encrypt
export function encrypt(payload: any): string {
  const text = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY, {
    mode: CryptoJS.mode.CTR,
  }).toString();
  return encrypted;
}

// Decrypt
export function decrypt(hash: string): any {
  try {
    const decrypted = CryptoJS.AES.decrypt(hash, ENCRYPTION_KEY, {
      mode: CryptoJS.mode.CTR,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedText);
    } catch (e) {
      return decryptedText;
    }
  } catch (err) {
    // logger.log(err);
    return false;
  }
}

export function encrypt2(string: any) {
  let randomIV = generateRandomIV();
  let iv = Buffer.from(randomIV);

  const data = Buffer.from(JSON.stringify(string));

  const cipher = createCipheriv("aes-256-ctr", ENCRYPTION_KEY, iv);
  let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  let encryptedHex = encrypted.toString("hex");

  let ivHex = iv.toString("hex");

  return (
    encryptedHex.slice(0, 10) +
    ivHex +
    encryptedHex.slice(10, encryptedHex.length)
  );
}

export function decrypt2(hash: any) {
  const iv = hash?.slice(10, 42);
  const content = hash?.slice(0, 10) + hash?.slice(42, hash?.length);

  const decipher = createDecipheriv(
    "aes-256-ctr",
    ENCRYPTION_KEY,
    Buffer?.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);

  try {
    return JSON.parse(decrypted.toString());
  } catch (e) {
    return decrypted.toString();
  }
}

function generateRandomIV() {
  let code = "";
  let possible = "0123456789";

  for (let i = 0; i < 16; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}
