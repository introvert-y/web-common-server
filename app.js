const child_process = require("child_process");
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
      this.app.messenger.on("customConfig", ([key, value]) => {
        if (!key || !value) {
          return;
        }
        that.app.config.apolloConfig[key] = value;
      });
    /**
     * 1、npm run dev 时为local
     * 2、npm run start 时为prod
     * 因为EGG_SERVER_ENV当NODE_ENV设置为production并且EGG_SERVER_ENV未指定时将设置为 prod
     * https://www.jianshu.com/p/dd355c7ecd22
     */
     if (env !== "local") {
      // Sentry.init({
      //   dsn: "https://035e07435ff142189005b2468d8bb063@logger2.zuzuche.com/39",
      //   environment: process.env.START_ENV,
      //   // We recommend adjusting this value in production, or using tracesSampler
      //   // for finer control
      //   tracesSampleRate: 1.0,
      // });
      // this.app.config.sentry = Sentry;
    }

  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // console.log('serverDidReady')
  }
}

module.exports = AppBootHook;
