/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = exports = {};
  config.version = 'web-common-service@1.0.0';
  config.keys = appInfo.name + '_1661310564371_9193';

  config.middleware = [];

  const userConfig = {
  };

  return {
    ...config,
    ...userConfig,
  };
};
