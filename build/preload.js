"use strict";

console.log("*************preload:*****************");
// 读取携程apollo配置中心，并创建default.env文件
const apollo = require("ctrip-apollo");
const path = require("path");
const fs = require("fs");
let apolloUrl = "";
switch (process.env.START_ENV) {
  case "prod":
    apolloUrl =
      "http://apollo-config.int.zuzuche.com" /*  "http://apolloconfig-api.zuzuche.info" */;
    break;
  case "test":
    apolloUrl = "http://zzc-test-configservice.zuzuche.net";
    break;
  default:
    apolloUrl = "http://zzc-test-configservice.zuzuche.net";
    break;
}
console.log("===apolloUrl===:" + apolloUrl);
const config = {
  configServerUrl: apolloUrl,
  appId: "web-ercp",
  cachePath: path.resolve(__dirname, "apolloConfig"),
  clusterName: "default",
  namespaceName: "web-common-service",
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
    .on("change", ({ key, oldValue, newValue }) => {
      let transformValue = newValue;
      switch (key) {
        case 'reqUrlMap':
        case 'clientConfigMap':
        case 'cdnUrlMap': {
          transformValue = JSON.parse(transformValue);
          break;
        }
      }
      process.env[key] = transformValue;
      process.send([key, transformValue]);
    });

  // - Fetch configurations for the first time
  // - start update notification polling (by default)
  try {
    const info = await ns.ready();
    const obj = info.config();
    console.log(">>>>>>>>>>>>>> first fetch >>>>>>>>>>");
    const totalConfigObject = {};
    for (var key in obj) {
      let transformValue = obj[key];
      switch (key) {
        case 'reqUrlMap':
        case 'clientConfigMap':
        case 'cdnUrlMap': {
          transformValue = JSON.parse(transformValue);
          break;
        }
      }
      totalConfigObject[key] = transformValue;
      process.env[key] = transformValue;
      process.send([key, transformValue]);
    }
    console.log('JSON.parse 后的完整配置', totalConfigObject);
  } catch(err) {
    console.log('err', err)
  }

};
start();

/**
 * 删除指定目录及其下的所有文件
 * @param {*} path
 */
function delDir(path) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });
  }
}
