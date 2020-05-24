'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index/home.nj', {
      username: '我是Nj'
    });
  }
}

module.exports = HomeController;
