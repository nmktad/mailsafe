import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOTP(length: number = 5) {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
}

export function computeHash(data: { subject: string, message: string }) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({ subject: data.subject, message: data.message }));

  return hash.digest('hex');
}
