'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const prefix = '';
  const { router, controller } = app;
  router.get(/\/Api(.*)/, controller.common.commonApi);
  router.get(prefix + '/test', controller.common.test);
  router.get(prefix + '/', controller.common.index);

};
