import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8000,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  FRAUD_LARGE_AMOUNT: Number(process.env.FRAUD_LARGE_AMOUNT) || 100000,
  FRAUD_CRITICAL_AMOUNT: Number(process.env.FRAUD_CRITICAL_AMOUNT) || 500000,
  FRAUD_RAPID_TRANSACTION_COUNT: Number(process.env.FRAUD_RAPID_TRANSACTION_COUNT) || 5,
  FRAUD_RAPID_TRANSACTION_WINDOW: Number(process.env.FRAUD_RAPID_TRANSACTION_WINDOW) || 5,

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};

// Fail fast if critical secrets are missing
const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}