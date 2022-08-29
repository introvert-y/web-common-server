/**
 * 拦截请求转发
 */
module.exports = () => {
  return async function interceptProxy(ctx, next) {
    const { path } = ctx.request;
    const templateKey = path.split('/')[2];
    console.log('ctx.app.config', ctx.app.config.apolloConfig)
    console.log(`path: ${path}, templateKey: ${templateKey}`)
    if (!templateKey) {
      return ctx.body = 'requst path no complete';
    }
    if (!ctx.app.config.apolloConfig.reqUrlMap || !ctx.app.config.apolloConfig.reqUrlMap[templateKey]) {
      return ctx.body = '没命中路径的映射';
    }
    await next();
  };
};
