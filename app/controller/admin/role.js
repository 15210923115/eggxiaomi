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
    async auth() {

        let role_id = this.ctx.request.query.id;

        let result = await this.service.admin.getAuthList(role_id);
        
        await this.ctx.render('admin/role/auth', {
            role_id,
            list: result
        });
    }
    async doAuth() {
        
        let role_id = this.ctx.request.body.role_id;
        let access_node = this.ctx.request.body.access_node;

        // 要授权
        // 1.删除当前角色下的所有权限
        await this.ctx.model.RoleAccess.deleteMany({'role_id': role_id});

        // 2.把获取的权限和角色增加到数据库
        for (let i = 0; i<access_node.length; i++) {
            let roleAccessData = new this.ctx.model.RoleAccess({
                role_id,
                access_id: access_node[i]
            });
            await roleAccessData.save();
        }
        
        await this.success(`/admin/role/auth?id=${role_id}`,'授权成功');
    }
}

module.exports = RoleController;
