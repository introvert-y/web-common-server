const Service = require('egg').Service;
const path = require("path");

const getUrlQueryParams = (obj) => Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
class commonService extends Service {
  async toRequestThePath(data) {
    const { ctx, config } = this;
    const { path } = ctx.request;
    const isGetMethods = ctx.method.toUpperCase() === 'GET' ;
    console.log('ctx.request.query', ctx.request.query, getUrlQueryParams(ctx.request.query))
    try {
      let options = {
        method: ctx.method,
        data: isGetMethods ? {} : ctx.request.body,
      };
      const contentTypeValue = ctx.headers['content-type'];
      if (contentTypeValue) {
        options.headers = {
          'Content-Type': ctx.headers['content-type'],
        };
      }
      const slicePath = path.slice(5); // 去除 '/api/'
      let requestUrl = '';
      if (slicePath.indexOf('/') === -1) {
        // 针对没有二级路径的情况，比如/api/upload
        requestUrl = config.apolloConfig.reqUrlMap[slicePath];
      } else {
        requestUrl = slicePath.replace(/(.*?)\//, (str) => {
          const keyword = str.slice(0, -1);
          return `${config.apolloConfig.reqUrlMap[keyword]}/${keyword === 'ercp' ? 'api/': ''}`;
        });
      }
      requestUrl += requestUrl + isGetMethods ? `?${getUrlQueryParams(ctx.request.query)}`: '';
      console.log('requestUrl', requestUrl)
      const res = await ctx.getCurlData(requestUrl, options);
      return res;
    } catch (err) {
      console.log('err', err)
      return { code: -1, data: null, message: JSON.stringify(err) };
    }
  }
  // 多语言按模板分类
  async langClassify({ keys }) {
    const { ctx } = this;
    const keyMap = {};
    const resMap = {};
    console.log('多语言按模板分类', keys)
    // 根据数组分类
    keys.map((item) => {
      if (item.indexOf('.') !== -1) {
        const [modalName, key] = item.split('.');
        if (!keyMap[modalName]) {
          keyMap[modalName] = [];
        }
        keyMap[modalName].push(key);
      }
      return item;
    });
    // 并发取值，并聚合
    const promiseList = Object.keys(keyMap).map(async (modalName) => {
      const modalData = await ctx.getLang(modalName, keyMap[modalName]);;
      Object.keys(modalData).map(key => {
        resMap[`${modalName}.${key}`] = modalData[key];
      })
    });
    // 按次序输出
     for (const itemPromise of promiseList) {
      await itemPromise;
    }
    console.log('resMap', resMap)
    return resMap;
  }
  async getLanguagePackage() {
    return this.ctx.getLanguagePackage();
  }
}
module.exports = commonService;
