/**
 * 注入唯一的key
 */
const store = require('../utils/requestId');
const { v4: uuidv4 } = require('uuid');
module.exports = () => {
  return async function injectTheOnlyKey(ctx, next) {
    const requestId = ctx.header['x-request-id'] || uuidv4();

    // 设置requestId
    store.run(() => {
      store.set('requestId', requestId);
    });
    await next();
    ctx.set('X-Request-Id', requestId);
  };
};
