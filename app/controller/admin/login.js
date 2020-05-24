'use strict';

const BaseController = require('./base');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('admin/login');
  }
  // 执行登录的方法 post方法
  async doLogin() {
    console.log(this.ctx.request.body);

    let username = this.ctx.request.body.username;
    let password = await this.service.tools.md5(this.ctx.request.body.password);
    let code = this.ctx.request.body.code;
    
    if (code.toUpperCase() === this.ctx.session.code.toUpperCase()) {// 将验证码用toUpperCase转换为大写，从而忽略大小写
      let result = await this.ctx.model.Admin.find({"username": username, "password": password});
      if (result.length > 0) {
        // 登录成功
        // 1.保存用户信息
        this.ctx.session.userinfo = result[0];
        // 2.跳转到用户中心
        this.ctx.redirect('/admin/manager');
      } else {
        await this.error('/admin/login', '用户名、密码错误');
      }
    } else {
      await this.error('/admin/login', '验证码错误');
    }
    /**
     * 注意：
     * 1.需要在前端页面用js验证用户输入的信息是否正确
     * 2.后台获取数据以后判断数据格式是否正确
     * 
     * 1.获取表单数据
     * 2.判断验证码是否正确（用户传过来的验证码和系统保存的验证码是否一样，系统生成的验证码保存在了session里）
     * 验证码正确
     *    1.要对表单里面的密码进行Md5加密 cnpm i md5 --save
     *    2.在用户表（集合）中查询当前用户是否存在
     *    3.如果数据库有此用户（登录成功）：保存用户信息 跳转到后台管理系统
     *    4.如果数据库没有此用户（登录失败）：跳转到登录页面
     * 
     * 验证码错误 跳转到登录页面
     *  
     */
  }
  async loginOut() {
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login');
  }
}

module.exports = LoginController;
