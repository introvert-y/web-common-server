'use strict';
/**
 * context上下文对象扩展
 */
const extend = require('extend');
//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
const exec = require('child_process').exec;
const adm_zip = require('adm-zip'); //需要引入adm-zip包

const MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1e3;

const readFile = function (src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports = {
  /**
   * 包装过的curl方法
   * @param {*} url
   * @param {*} options
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
          options.headers,
        ) || {};
      options = Object.assign(
        {
          dataType: 'json',
          timeout: 60000,
        },
        options,
      );
      // console.log('url,options**##############:', url, options);
      let ret = await this.curl(url, options);
      if (!ret) {
        ret = {
          data: {
            data: null,
            message: 'interface return null',
            code: 500,
          },
        };
      } else if (
        returnType !== 1 &&
        ret.data &&
        ret.data.code != 0 &&
        ret.data.code != 'success' &&
        ret.data.code != 401 &&
        ret.data.message != '未找到相应的用户信息'
      ) {
        // console.log('####################');
        // console.log('服务端错误:', JSON.stringify(ret.data));
        // console.log('*************************');
        this.sendLogger(ret ? ret.data : ret, options.headers);
      }
      return returnType === 1 ? ret : ret.data;
    } catch (err) {
      console.log(
        '请求错误 error: url,optionsData, optionsHeaders ##############:',
        url,
        // options.data,
        options.headers,
      );
    }
  },
  async generateResponseJson(code, data, message) {
     const result = {
      code: code || -1,
      data: data || {},
      message: message || '',
    };
    return result;
  },
  /**
   * logger
   */
  sendLogger(msg, options = {}) {
    this.logger.error({
      id: new Date().getTime(),
      pid: process.pid,
      msg,
      options,
      routerPath: this.routerPath,
    });
  },
  /**
   * 下载语言包
   */
  async getLanguagePackage() {
    const langFileUrl = path.resolve(__dirname, '../../lang/');
    let hasPackage = false;

    const mkdir = 'mkdir -p ' + langFileUrl;
    const child = exec(mkdir, function (err, stdout, stderr) {
      if (err) throw err;
    });
    console.log('正在下载语言包......', this.app.config.apolloConfig.language);
    const ret = await this.curl(this.app.config.apolloConfig.language, {
      method: 'GET',
      timeout: 600000,
    });
    console.log('正在解压语言包......');
    fs.writeFile(`${langFileUrl}/lang.zip`, ret.data, async function (err) {
      if (err) throw err;
      // 解压缩
      const unzip = await new adm_zip(`${langFileUrl}/lang.zip`);
      unzip.extractAllTo(`${langFileUrl}/content`, true);
      console.log('解压完成!');
      hasPackage = true;
      return hasPackage;
    });
    return hasPackage;
  },
  /**
   * 获取语言
   * @param {} module
   * @param {*} key
   * 优化点redis缓存，每次先判断module是否在redis中，
   * 有就直接返回，没有就readFile，再加入缓存
   */
  async getLang(module, keys, lng) {
    const language = lng || this.cookies.get('language') || 'zh_CN';
    const langFileUrl = path.resolve(
      __dirname,
      `../../lang/content/locale/${language}/${module}.json`,
    );
    // 判断是否存在, 不在就返回
    if (!module || !keys || !fs.existsSync(langFileUrl)) {
      return {};
    }

    //读取json文件
    const res = await readFile(langFileUrl, 'utf-8');
    const data = res.toString();

    let values = {};
    let lang = JSON.parse(data);
    (keys || []).map((item) => {
      values[item] = lang[item] ? lang[item].replace('\n', '') : '';
    });
    return values;
  },
};
