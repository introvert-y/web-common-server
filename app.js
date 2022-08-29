const child_process = require('child_process');
// const Sentry = require("@sentry/node");

// app.js 入口文件
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    // 例如：插入一个中间件到框架的 coreMiddleware 之间
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    // 例如：创建自定义应用的示例
    // 例如：加载自定义的目录
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存
  }

  async didReady() {
    // 应用已经启动完毕
    const env = this.app.config.env;
    const that = this;
    // 启动触发
    this.app.messenger.on('customConfig', ([key, value]) => {
      if (!key || !value) {
        return;
      }
      that.app.config.apolloConfig[key] = value;
    });
    /**
     * npm run dev
     * 因为agent只在最初ready的时候广播了配置，
     * 但是每次改动会再次触发该流程，导致配置丢失
     * 所以补充这个事件来获取配置
     */
    this.app.messenger.sendToAgent('getConfig', process.pid);
    this.app.messenger.on('getAllConfig', (data) => {
      that.app.config.apolloConfig = data;
    });
    /**
     * 1、npm run dev 时为local
     * 2、npm run start 时为prod
     * 因为EGG_SERVER_ENV当NODE_ENV设置为production并且EGG_SERVER_ENV未指定时将设置为 prod
     * https://www.jianshu.com/p/dd355c7ecd22
     */
    if (env !== 'local') {
      Sentry.init({
        dsn: 'https://bffacb4cf6da4870ae9f35f84338a493@logger2.zuzuche.com/64',
        release: this.app.config.keys,
      });
      this.app.config.sentry = Sentry;
    }
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // console.log('serverDidReady')
  }
}

module.exports = AppBootHook;
