import * as Crypto from "expo-crypto";

export async function createRawNonce() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function hashNonce(value: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value,
  );
}
