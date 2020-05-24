'use strict';
// 角色管理
const BaseController = require('./base');

class RoleController extends BaseController {
    async index() {
        await this.ctx.render('admin/role/index');
    }
    async add() {
        await this.ctx.render('admin/role/add');
    }
    async edit() {
        await this.ctx.render('admin/role/edit');
    }
    async delete() {
        await this.ctx.render('admin/role/delete');
    }
}

module.exports = RoleController;
