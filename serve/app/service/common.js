const Service = require('egg').Service;
class CommonService extends Service {
  /**
   * 公共接口转发
   * @param {*} data 请求参数
   * @param {*} domainType 域名类型 zuul,zuul_cn,main,gateway,upload
   * @param {*} method 请求方式
   * @param {*} dataType 参数类型
   * @return
   */
  async proxyService(data, domainType, method, dataType) {
    const { ctx } = this;
    method = method || 'POST';
    dataType = dataType || 'json';
    try {
      // 域名
      const domain = domainType ? this.config[domainType] : this.config.zuul;
      // 获取当前请求url
      const path = ctx.request.url.match(/\/Api(.*)/);
      // 获取请求aip名
      const pathName = path[1].replace(/\//, '');
      // console.log('this.config.api_url>>>>>>', this.config.api_url, typeof this.config.api_url);
      // 获取真实api路径
      const apiUrlConfig = JSON.parse(this.config.api_url);
      // console.log('apiUrlConfig', apiUrlConfig);
      const apiUrl = apiUrlConfig[pathName];
      // console.log('proxyService >>>>>>>', path, data, method, dataType);
      if (!path || !apiUrl) {
        console.log('请求地址错误 path,apiUrl>>>>>>', path, apiUrl);
        return { code: -1, message: 'request url error', data: null };
      }

      const res = await ctx.getCurlData(domain + apiUrl, {
        method,
        dataType,
        data,
      });
      return res;
    } catch (error) {
      console.log('******接口转发报错******', error);
      return { code: -1, message: 'egg error', data: null };
    }
  }
  /**
   * 文件上传 base64
   * @param {*} data
   * @return
   */
  async uploadFile(data) {
    const { ctx } = this;
    try {
      const res = await ctx.getCurlData(
        this.config.upload + '/upload.php',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          data,
        }
      );
      if (res.data.code !== 0) {
        res.data.data = null;
      }
      return res.data;
    } catch (err) {
      return {
        code: -1,
        data: null,
        message: JSON.stringify(err),
      };
    }
  }
}
module.exports = CommonService;
