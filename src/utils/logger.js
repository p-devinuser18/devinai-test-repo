const { createLogger, format, transports } = require('winston');

const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
  level: 'debug',
  format: isProduction
    ? format.combine(
        format.timestamp(),
        format.json()
      )
    : format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${message}${metaStr}`;
        })
      ),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
