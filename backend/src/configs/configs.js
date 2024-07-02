module.exports = {
  corsOptions: {
    origin: '*', // Or use an array of domains "http://example1.com, http://example2.com"
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  },
  PORT: process.env.PORT || 3000,
  TIMEOUT: 10000,
  RATE_LIMITER: {
    WINDOW_MS: 1 * 60 * 1000, // 15 minutes
    MAX: 100000, // limit each IP to 100 requests per windowMs
  },
};
