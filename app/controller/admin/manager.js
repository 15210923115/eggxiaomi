'use strict';
// 管理员管理
const BaseController = require('./base');

class ManagerController extends BaseController {
    async index() {
        // 查询管理员表，并关联角色表
        let result = await this.ctx.model.Admin.aggregate([
            {
                $lookup: {
                    from: 'role',
                    localField: 'role_id',
                    foreignField: '_id',
                    as: 'role'
                }
            }
        ]);
        console.log(JSON.stringify(result));
        await this.ctx.render('admin/manager/index', {
            list: result
        });
    }
    async add() {
        // 获取角色
        let roleResult = await this.ctx.model.Role.find({});
        await this.ctx.render('admin/manager/add', {
            roleResult: roleResult
        });
    }
    async doAdd() {
        let addResult = await this.ctx.request.body;
        addResult.password = await this.service.tools.md5(addResult.password);// 将密码进行Md5加密后，存储到数据库里
        // 判断当前用户是否存在
        let adminResult = await this.ctx.model.Admin.find({"username": addResult.username});
        if (adminResult.length > 0) {
            await this.error('/admin/manager/add', '此管理员已经存在');
        } else {
            let admin = new this.ctx.model.Admin({
                ...addResult
            });
            await admin.save();
            await this.success('/admin/manager', '增加用户成功');
        }
    }
    async edit() {
        // 获取角色
        let roleResult = await this.ctx.model.Role.find({});
        // 获取用户数据
        let id = this.ctx.request.query.id;
        let adminResult = await this.ctx.model.Admin.find({"_id": id});

        await this.ctx.render('admin/manager/edit', {
            roleResult: roleResult, // 角色列表
            adminResult: adminResult[0] // 当前用户的数据
        });
    }
    async doEdit() {
        let body = this.ctx.request.body;
        // console.log(body);
        let id = this.ctx.request.body.id;
        let mobile = this.ctx.request.body.mobile;
        let email = this.ctx.request.body.email;
        let role_id = this.ctx.request.body.role_id;
        let password = this.ctx.request.body.password;

        if (password) {
            // 如果密码存在，修改密码
            password = await this.ctx.service.tools.md5(password);
            await this.ctx.model.Admin.updateOne({"_id": id},{
                mobile, 
                email, 
                role_id,
                password
            });
        } else {
            // 密码不存在，不修改密码
            await this.ctx.model.Admin.updateOne({"_id": id},{
                mobile, 
                email,
                role_id
            });
        }

        await this.success('/admin/manager', '修改用户信息成功');
    }
};

module.exports = ManagerController;