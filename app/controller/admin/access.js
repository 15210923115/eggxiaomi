'use strict';
// 权限管理
const BaseController = require('./base');

class AccessController extends BaseController {
    async index() {
        // 1.在access表中找出module_id为'0'的数据  管理员管理 权限管理 角色管理
        
        // 2.让access表和access表关联 条件：找出access表中module_id等于_id的数据

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
        console.log(result);

        await this.ctx.render('admin/access/index', {
            list: result
        });
    }
    async add() {
        // 获取模块列表
        let result = await this.ctx.model.Access.find({module_id: '0'});
        await this.ctx.render('admin/access/add', {
            moduleList: result
        });
    }
    async doAdd() {
        let addResult = this.ctx.request.body;
        let module_id = addResult.module_id;
        if (module_id && module_id !== '0') {
            addResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
        }
        let access = new this.ctx.model.Access(addResult);
        await access.save();
        await this.success('/admin/access', '增加权限成功');
    }
    async edit() {
        var id=this.ctx.request.query.id;

        //获取编辑的数据

        var accessResult=await this.ctx.model.Access.find({"_id":id});

        var result=await this.ctx.model.Access.find({"module_id":"0"});
        
        await this.ctx.render('admin/access/edit',{
            list:accessResult[0],
            moduleList:result
        }); 
    }
    async doEdit() {
        let updateResult = this.ctx.request.body;
        let module_id = updateResult.module_id;
        let id = updateResult.id;
        if (module_id && module_id !== '0') {
            updateResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
        }
        await this.ctx.model.Access.updateOne({"_id": id},updateResult);
        await this.success('/admin/access', '修改权限成功');
    }
    async delete() {
        await this.ctx.render('admin/access/delete');
    }
}

module.exports = AccessController;
