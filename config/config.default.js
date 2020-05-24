/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1590216764123_908';

  // add your middleware config here
  config.middleware = [
    'adminauth'
  ];

  config.adminauth = {// 配置中间件匹配的路由，只有后台管理系统才需要走这个中间件
    match: '/admin'
  };

  // 配置模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
      '.nj': 'nunjucks'
    }
  };

  // 配置session
  config.session = {
    key: 'SESSION_ID',
    maxAge: 864000,
    httpOnly: true,
    encrypt: true,
    renew: true // 延长会话有效期 如果有效期是10s，用户在第9s的时候，访问了服务器，则在给他延长10s访问时间
  };

  config.mongoose = {
    url: 'mongodb://eggxiaomi:123456@127.0.0.1:27017/eggxiaomi',
    options: {}
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
