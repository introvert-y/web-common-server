/**
 * 拦截渲染模板
 */
module.exports = () => {
  return async function interceptRenderTemplate(ctx, next) {
    const { path } = ctx.request;
    const templateKey = path.split('/')[1];
    if (!ctx.app.config.apolloConfig.cdnUrlMap || !ctx.app.config.apolloConfig.cdnUrlMap[templateKey]) {
      return ctx.body = '没命中模板的映射';
    }
    await next();
  };
};
