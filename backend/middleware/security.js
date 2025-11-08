const helmet = require('helmet');

const securityMiddleware = (app) => {
  // Basic security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
  }));

  // Trust proxy for production
  app.set('trust proxy', 1);
};

module.exports = securityMiddleware;