import winston from 'winston';

// Random change 1: adding a harmless comment for commit tracking
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});
