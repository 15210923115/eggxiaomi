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
  // 封装一个删除方法
  async delete() {
    /**
     * 1.获取要删除的数据库表  model
     * 2.获取要删除数据的id  _id
     * 3.执行删除
     * 4.返回到以前的页面 ctx.request.headers['referer'] 上一页的地址
     */
    let model = this.ctx.request.query.model;
    let id = this.ctx.request.query.id;
    await this.ctx.model[model].deleteOne({"_id": id});
    this.ctx.redirect(this.ctx.state.prevPage);
  }
}

module.exports = BaseController;
