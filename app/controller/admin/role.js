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
        /**
         * 1.获取全部权限
         * 2.查询当前角色拥有的权限（查询当前角色的权限id）把查找到的数据放在数组中
         * 3.循环遍历所有的权限数据  判断当前权限是否在角色权限的数组中  如果在角色权限的数组中：选中   如果不在角色权限的数组中：不选中
         */

        let role_id = this.ctx.request.query.id;
        // 1.获取全部权限
        let result = await this.ctx.model.Access.aggregate([ 
            {
                $lookup: {
                    from: 'access', // 自关联（让自己关联自己，相当于把这个access当成两个表使用）
                    localField: '_id',
                    foreignField: 'module_id', 
                    as: 'items'
                }
            },
            {
                $match: {
                    "module_id": '0'
                }
            }
        ]);
        // 2.查询当前角色拥有的权限（查询当前角色的权限id）把查找到的数据放在数组中
        let accessResult = await this.ctx.model.RoleAccess.find({"role_id": role_id});
        let roleAccessArray = [];
        accessResult.forEach(value => {
            roleAccessArray.push(value.access_id.toString());
        }); 
        console.log(roleAccessArray);
        // 3.循环遍历所有的权限数据  判断当前权限是否在角色权限的数组中  如果在角色权限的数组中：选中   如果不在角色权限的数组中：不选中
        for (let i = 0; i<result.length; i++) {
            if (roleAccessArray.includes(result[i]._id.toString())) {
                result[i].checked = true;
            }

            for (let j = 0; j<result[i].items.length; j++) {
                if (roleAccessArray.includes(result[i].items[j]._id.toString())) {
                    result[i].items[j].checked = true;
                }
            }
        }

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
