const winston = require('winston');

// Define the logger configuration
const logger = winston.createLogger(
{
  level: 'debug',
  format: winston.format.combine
  (
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: 
  [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add a console transport for logging to the console during development
if (process.env.NODE_ENV !== 'production') 
{
  logger.add(new winston.transports.Console());
}

module.exports = logger;
