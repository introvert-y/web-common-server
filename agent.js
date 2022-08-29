const child_process = require('child_process');
module.exports = app => {
  app.messenger.on('egg-ready', async () => {
    const ctx = await app.createAnonymousContext();
    let child = child_process.fork("./build/preload.js");
    console.log('agent 进程')
      try {
        child &&
          child.on("message", async (m) => {
            if (m && m.length === 2) {
              const [key, value] = m;
              let transformValue = value;
              switch (key) {
                case 'reqUrlMap':
                case 'cdnUrlMap': {
                  transformValue = JSON.parse(value);
                  break;
                }
              }
              if (key === 'language') {
                // app.config.apolloConfig[key] = transformValue;
                // ctx.getLanguagePackage();
                // return;
              }
              app.messenger.sendToApp('customConfig', [key, transformValue]);
            }
          });
      } catch (err) {
        console.log("agent.js err" + err);
      }
  });
}
