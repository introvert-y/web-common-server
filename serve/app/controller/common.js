'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = ctx.request.url;
  }
  async test() {
    const { ctx } = this;
    ctx.body = 'common success';
  }
  // 公共转发
  async commonApi() {
    const { ctx } = this;
    console.log('commonApi >>>>>>>>>>>>>');
    ctx.body = ctx.request.url;
    const res = await ctx.service.common.proxyService(ctx.request.body);
    return (ctx.body = res);
  }
  // 文件上传
  async uploadImage() {
    const { ctx } = this;
    const nullDataMsg = {
      code: -1,
      data: null,
      message: '上传失败',
    };
    const data = Object.assign({
      type: 'base64',
      ...ctx.request.body,
    });

    const res = await ctx.service.common.uploadFile(data);
    if (res.code !== 0 || res.message === 'required field cannot be empty') {
      return nullDataMsg;
    }
    return res;
  }
}

module.exports = HomeController;
