import { error } from "console";
import winston from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = winston.format;

const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const errorlog: DailyRotateFile = new DailyRotateFile({
  level: 'error',
  filename: 'applicationerror-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(errorFilter(), timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS A",
  }), json())
});

const infolog: DailyRotateFile = new DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(infoFilter(), timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS A",
  }), json())
});

export const logger = winston.createLogger({
  level: "http",
  format: combine(timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS A",
  }), json()),
  transports: [
    infolog,
    errorlog
  ],
});
