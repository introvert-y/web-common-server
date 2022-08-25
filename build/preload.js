'use strict';

console.log('*************preload:*****************');
// 读取携程apollo配置中心，并创建default.env文件
const apollo = require('ctrip-apollo');
const path = require('path');
const fs = require('fs');
let apolloUrl = '';
switch (process.env.START_ENV) {
  case 'prod':
    apolloUrl =
      'http://apollo-config.int.zuzuche.com';
    break;
  case 'pre':
    apolloUrl = 'http://10.2.239.220:8080';
    break;
  case 'test':
    apolloUrl = 'http://zzc-test-configservice.zuzuche.net';
    break;
  default:
    apolloUrl = 'http://zzc-test-configservice.zuzuche.net';
    break;
}
console.log('===apolloUrl===:' + apolloUrl);
const config = {
  configServerUrl: apolloUrl,
  appId: 'ercp-rental-web-IDC',
  cachePath: path.resolve(__dirname, 'apolloConfig'),
  clusterName: 'default',
  namespaceName: 'web-common-service',
  fetchInterval: 3 * 60 * 1000,
};

const start = async () => {
  delDir(config.cachePath);
  const ns = apollo({
    host: config.configServerUrl,
    appId: config.appId,
    cachePath: config.cachePath,
  })
    .cluster(config.clusterName)
    .namespace(config.namespaceName)
    .on('change', ({ key, oldValue, newValue }) => {
      process.env[key] = newValue;
      process.send([ key, newValue ]);
    });

  const info = await ns.ready();
  const obj = info.config();
  for (const key in obj) {
    process.env[key] = obj[key];
    process.send([ key, obj[key] ]);
  }
};
start();
/**
 * 删除指定目录及其下的所有文件
 * @param {*} path
 */
function delDir(path) {
  // const files = [];
  if (fs.existsSync(path)) {
    /* files = fs.readdirSync(path); */
    /* files.forEach((file, index) => {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); // 递归删除文件夹
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    }); */
    fs.rmdirSync(path, { recursive: true });
  }
}
