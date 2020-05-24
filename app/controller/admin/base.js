'use strict';
// 父类 
// controller层，公共的功能，都可以放到这里面，让其它的controller继承这个BaseController


const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    // this.ctx.body = '成功';
    await this.ctx.render('admin/public/success', {
        redirectUrl: redirectUrl,
        message: message || '操作成功'
    });
  }
  async error(redirectUrl, message) {
      await this.ctx.render('admin/public/error', {
        redirectUrl: redirectUrl,
        message: message || '操作失败'
      });
  }
  async verify() {
    let captcha = await this.service.tools.captcha(); // 调用服务里的方法来生成验证码
    this.ctx.response.type = 'image/svg+xml'; // 返回指定的类型
    this.ctx.body = captcha.data; // 给页面返回一张图片
  }
}

module.exports = BaseController;
