# web-common-server

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

### 后续优化点
≈ 接入 egg-redis 缓存多语言的模块和 html 模板
- 这个项目是为了解决配置化更改的便利性，有些客户端用了 i18n, 看能否延缓 i18n 实例化，来达到获取多语言流程的最小改动，否则只能每进个页面走个请求拿该页面的所有多语言配置 /getLangByKeys。
- 打开 csrf 校验，以及设置白名单，防止接口盗刷，需通知其他部门上报域名

```bash
 config.security= {
    csrf : {
      enable: false,
      // headerName: 'x-csrf-token',// 自定义请求头
    }
 }
```

### 常见问题
- 本地开发的时候如何拿多语言和相应的配置信息——
无代码侵入式.保底方案：去配置中心复制相应配置注入window.PAGE_CONFIG
- 客户端登陆如何绕过，去测试或线上环境复制相应的token到cookie

- 客户端请求路由如 localhost:9000/api/ercp/test 会转发到 web-ercp-rental-service服务(处理复杂业务)
- 客户端请求路由如 localhost:9000/api/zuul/xxx 会转发到 zuul服务
