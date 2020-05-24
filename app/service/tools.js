'use strict';

const svgCaptcha = require('svg-captcha');
const md5 = require('md5');

const Service = require('egg').Service;

class ToolsService extends Service {
    // 生成验证码
	async captcha() {
		let captcha = svgCaptcha.create({
			size: 2,
			fontSize: 50,
			width: 100,
			height: 40,
			background: "#cc9966"
		});
		this.ctx.session.code = captcha.text; // 验证码上面的信息

		return captcha;
	  }
	  async md5(str) {
		  return md5(str);
	  }
}

module.exports = ToolsService;
