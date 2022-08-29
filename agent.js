const child_process = require('child_process');
module.exports = (app) => {
  app.messenger.on('egg-ready', async () => {
    const ctx = await app.createAnonymousContext();
    let child = child_process.fork('./build/preload.js');
    console.log('agent 进程启动');
    try {
      child &&
        child.on('message', async (m) => {
          if (m && m.length === 2) {
            const [key, value] = m;

            app.config.apolloConfig[key] = value;

            if (key === 'language') {
              ctx.getLanguagePackage();
              return;
            }
            app.messenger.sendToApp('customConfig', [key, value]);
          }
        });
    } catch (err) {
      console.log('agent.js err' + err);
    }
    app.messenger.on('getConfig', async (pid) => {
      console.log('agent getConfig worker pid', pid);
      try {
        app.messenger.sendTo(pid, 'getAllConfig', app.config.apolloConfig);
      } catch (err) {
        console.log('agent.js err' + err);
      }
    });
  });

};
