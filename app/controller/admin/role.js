'use strict';
// 角色管理
const BaseController = require('./base');

class RoleController extends BaseController {
    async index() {
        let result = await this.ctx.model.Role.find({});

        await this.ctx.render('admin/role/index', {
            list: result
        });
    }
    async add() {
        await this.ctx.render('admin/role/add');
    }
    async doAdd() {
        let role = new this.ctx.model.Role({
            title: this.ctx.request.body.title,
            description: this.ctx.request.body.description
        });
        let result = await role.save();
        console.log(result);
        await this.success('/admin/role', '增加角色成功');
    }
    async edit() {
        let id = this.ctx.query.id;
        let result = await this.ctx.model.Role.find({"_id": id});

        await this.ctx.render('admin/role/edit', {
            list: result[0]
        });
    }
    async doEdit() {
        let _id = this.ctx.request.body._id;
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;
        await this.ctx.model.Role.updateOne({"_id": _id},{
            title, description
        });
         await this.success('/admin/role', '编辑角色成功');    
    }
    async delete() {
        await this.ctx.render('admin/role/delete');
    }
}

module.exports = RoleController;
