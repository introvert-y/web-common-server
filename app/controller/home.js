'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async proxyRequest() {
    const { ctx } = this;
    return (ctx.body = await ctx.service.common.toRequestThePath(
      ctx.request.body,
    ));
  }
  async uploadByFile() {
    const { ctx } = this;
    return (ctx.body = await ctx.service.common.uploadByFile(
      ctx.request.body,
    ));
  }
  async getLanguageBykeys() {
    const { ctx, app } = this;
     return ctx.body = await ctx.service.common.langClassify(ctx.request.body)
  }
  async renderTemplate() {
    const { ctx, config, app } = this;
    const { path } = ctx.request;
    const templateKey = path.split('/')[1];
    // templateKey： domain/login
    // const result = await ctx.curl(
    //   'http://static.zuzuche.com/assets/ercp/otherWeb/test/1661234270455/index.html',
    // );
    try {
      const result = await ctx.curl(config.apolloConfig.cdnUrlMap[templateKey]);
      ctx.body = await ctx.renderString(result.data.toString(), {
        // 对应需要注入的动态配置
      });
    } catch (err) {
      console.log('请求cdn模板错误', err);
    }
  }
}

module.exports = HomeController;
