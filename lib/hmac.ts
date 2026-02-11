// lib/hmac.ts

import crypto from "crypto";

const WINDOW_SECONDS = 30;

export function generateTimeWindow(): number {
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.floor(currentTime / WINDOW_SECONDS);
}

export function generateHMACToken(
  secretSeed: string,
  sessionId: string
): string {
  const window = generateTimeWindow();

  const data = `${sessionId}:${window}`;

  const hmac = crypto
    .createHmac("sha256", process.env.HMAC_SECRET!)
    .update(secretSeed + data)
    .digest("hex");

  return hmac;
}

export function verifyHMACToken(
  providedToken: string,
  secretSeed: string,
  sessionId: string
): boolean {
  const currentWindow = generateTimeWindow();
  const previousWindow = currentWindow - 1;

  const generate = (window: number) => {
    const data = `${sessionId}:${window}`;
    return crypto
      .createHmac("sha256", process.env.HMAC_SECRET!)
      .update(secretSeed + data)
      .digest("hex");
  };

  const validCurrent = generate(currentWindow);
  const validPrevious = generate(previousWindow);

  return (
    providedToken === validCurrent || providedToken === validPrevious
  );
}