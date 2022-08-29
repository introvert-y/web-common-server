'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  const interceptProxy = app.middleware.interceptProxy({
    app,
  });
  const interceptRenderTemplate = app.middleware.interceptRenderTemplate({
    app,
  });
  const injectTheOnlyKey = app.middleware.injectTheOnlyKey({
    app,
  });
  router.post('/getLangByKeys',  controller.home.getLanguageBykeys);
  router.get('/api/*', interceptProxy, injectTheOnlyKey, controller.home.proxyRequest);
  router.post('/api/*', interceptProxy, injectTheOnlyKey, controller.home.proxyRequest);
  router.get(
    '/*',
    interceptRenderTemplate,
    injectTheOnlyKey,
    controller.home.renderTemplate,
  );
};
