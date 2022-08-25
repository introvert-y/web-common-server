'use strict';
const MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1e3;
module.exports = {
  /**
   * 包装过的curl方法
   * @param {*} url
   * @param {*} options
   * @param returnType
   */
  async getCurlData(url = '', options = {}, returnType) {
    try {
      const ua = this.get('User-Agent') || '';

      options.headers =
        Object.assign(
          {
            'User-Agent': `${ua}`,
            'Content-Type': 'application/json',
          },
          options.headers
        ) || {};

      options = Object.assign({ dataType: 'json', timeout: 60000 }, options);
      const ret = await this.curl(url, options);
      console.log('url, options.data, options.header: *********', url, options.data, options.headers);
      if (
        returnType !== 1 &&
        (!ret ||
          !ret.data ||
          (ret.data.code !== 0 &&
            ret.data.code !== 200 &&
            ret.data.code !== 'success' &&
            ret.data.code !== -1 &&
            ret.data.message !== 'OCR failed'))
      ) {
        console.log('url,data##############:', url, options.data);
        console.log('####################');
        console.log('服务端错误:', JSON.stringify(ret.data));
        if (!ret.data) {
          // 接口无返回
          ret.data = { code: -1, message: 'service error，no refund', data: null };
        }
      }
      return returnType === 1 ? ret : ret.data;
    } catch (err) {
      console.log(
        '请求错误 error: url,optionsData, optionsHeaders ##############:',
        url,
        options.data,
        options.headers
      );
      console.log('请求错误 error:', err);
    }
  },
  /**
   *
   * @param {*} key
   * @param {*} value
   * @param {*} options
   */

  setCookie(key, value, options) {
    const date = new Date();
    date.setTime(date.getTime() + 365 * MILLISECONDS_OF_DAY);
    this.cookies.set(
      key,
      value,
      Object.assign(
        {
          expires: date,
        },
        options
      )
    );
  },
  /**
   * 发送捕获错误
   * @param {*} errInfo
   * @param {*} level
   * @param {*} err
   */
  sendError(errInfo, level, err) {
    const Sentry = this.app.config.sentry;
    Sentry &&
      Sentry.withScope(scope => {
        scope.setTag('my-tag', errInfo);
        scope.setLevel(level);
        scope.addEventProcessor(event =>
          Sentry.Handlers.parseRequest(event, this.request)
        );
        console.log('errInfo:', errInfo);
        console.log('level:', level);
        console.log('err:', err);

        scope.setExtra('data', err);
        Sentry.captureException(new Error(err));
      });
  },
};
