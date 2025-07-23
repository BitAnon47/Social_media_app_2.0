const redis = require('../../utils/redisClient'); // Adjust the path if needed

// Central Role Configuration
const roleConfig = {
  user: {
    token: { limit: 10, refill: 1, refillTime: 5 },   // 1 token per 5 sec, max 10
    slide: { limit: 10, window: 60 },                 // 10 requests per 60 sec
  },
  guest: {
    token: { limit: 5, refill: 1, refillTime: 10 },   // 1 token per 10 sec, max 5
    slide: { limit: 5, window: 60 },                  // 5 requests per 60 sec
  }
};

// 🔐 Token Bucket Limiter
const tokenBucketLimiter = () => {
  return async (req, res, next) => {
    try {
      const role = req.user ? 'user' : 'guest';
      const id = req.user?.id || req.ip;
      const { limit, refill, refillTime } = roleConfig[role].token;
      const key = `rate:token:${role}:${id}`;
      const now = Date.now();

      const bucket = await redis.hgetall(key);
      let tokens = parseFloat(bucket.tokens || limit);
      let lastRefill = parseInt(bucket.lastRefill || now);

      const elapsed = (now - lastRefill) / 1000;
      const newTokens = Math.floor(elapsed / refillTime) * refill;
      tokens = Math.min(limit, tokens + newTokens);
      lastRefill = now;

      if (tokens < 1) {
        return res.status(429).json({ message: 'Too many requests. Try again later.' });
      }

      await redis.hmset(key, {
        tokens: tokens - 1,
        lastRefill
      });
      await redis.expire(key, 3600);

      next();
    } catch (err) {
      console.error('Token Bucket Error:', err);
      return res.status(500).json({ message: 'Internal Token Bucket Error' });
    }
  };
};

// ⏱️ Sliding Window Limiter
const slidingWindowLimiter = () => {
  return async (req, res, next) => {
    try {
      const role = req.user ? 'user' : 'guest';
      const id = req.user?.id || req.ip;
      const { limit, window } = roleConfig[role].slide;
      const now = Date.now();
      const key = `rate:slide:${role}:${id}`;

      await redis.zadd(key, now, `${now}`);
      await redis.zremrangebyscore(key, 0, now - window * 1000);
      const count = await redis.zcard(key);
      await redis.expire(key, window);

      if (count > limit) {
        return res.status(429).json({
          message: 'Too many requests. Please try again after some time.',
        });
      }

      next();
    } catch (err) {
      console.error('Sliding Window Error:', err);
      return res.status(500).json({ message: 'Internal Sliding Window Error' });
    }
  };
};

module.exports = {
  tokenBucketLimiter,
  slidingWindowLimiter
};
