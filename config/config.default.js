/* eslint valid-jsdoc: "off" */

'use strict';
const path = require("path");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1661412810624_5768';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.view = {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".html": "nunjucks",
    },
  };
  config.logger = {
    consoleLevel: "ERROR",
    // 是否关闭终端日志
    // disableConsoleAfterReady: false,
    outputJSON: true,
    dir: path.join(appInfo.baseDir, "logs"),
  };

  config.bodyParser = {
    formLimit: "100mb",
    jsonLimit: "100mb",
    textLimit: "100mb",
    // 值的大小可以根据自己的需求修改 这里只做演示
  };
  // config.multipart = {
  //   mode: "file",
  //   whitelist: [
  //     // images
  //     ".jpg",
  //     ".jpeg", // image/jpeg
  //     ".png", // image/png, image/x-png
  //     ".gif", // image/gif
  //     ".bmp", // image/bmp
  //     ".wbmp", // image/vnd.wap.wbmp
  //     ".webp",
  //     ".tif",
  //     ".psd",
  //     // text
  //     ".svg",
  //     ".js",
  //     ".jsx",
  //     ".json",
  //     ".css",
  //     ".less",
  //     ".html",
  //     ".htm",
  //     ".xml",
  //     // tar
  //     ".zip",
  //     ".gz",
  //     ".tgz",
  //     ".gzip",
  //     // video
  //     ".mp3",
  //     ".mp4",
  //     ".avi",
  //     ".pdf",
  //   ],
  // };
  config.apolloConfig = {}
  config.security= {
    csrf : {
      enable: false,
      // headerName: 'x-csrf-token',// 自定义请求头
    }
 }
  return {
    ...config,
    ...userConfig,
  };
};
