import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
  level: "http",
  format: combine(timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS A",
  }), json()),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
