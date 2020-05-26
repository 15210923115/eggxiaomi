'use strict';

const url = require('url');
const Service = require('egg').Service;

class AdminService extends Service {
  async checkAuth() {
    /**
     * 1.获取当前用户的角色
     * 2.根据角色获取当前角色的权限列表
     * 
     * 3.获取当前访问的url 对应的权限id
     * 4.判断当前访问的url 对应的权限id 是否在权限列表中的id中
     */

    // 1.获取当前用户的角色
    let userinfo = this.ctx.session.userinfo;

    let role_id = userinfo.role_id;

    let pathname = url.parse(this.ctx.request.url).pathname; // 获取当前用户访问的地址

    // （1）忽略权限判断的地址  （2）is_super表示是否是超级管理员 1-是 0-不是 （超级管理员的作用是登录后台系统，不需要验证角色，他有所有的权限）
    let ingoreUrl = ['/admin/login', '/admin/doLogin', '/admin/verify', '/admin/loginOut'];

    if (ingoreUrl.indexOf(pathname) != -1 || userinfo.is_super == 1) {
        return true; // 允许访问
    }

    // 2.根据角色获取当前角色的权限列表
    let accessResult = await this.ctx.model.RoleAccess.find({"role_id": role_id});
    let accessArray = [];// 获取当前角色可以访问的权限的id列表
    accessResult.forEach(value => {
        accessArray.push(value.access_id.toString());
    });

    // 3.获取当前访问的url 对应的权限id
    let accessUrlResult = await this.ctx.model.Access.find({"url": pathname});

    // 4.判断当前访问的url 对应的权限id 是否在权限列表中的id中
    if (accessUrlResult.length > 0) {
        if (accessArray.indexOf(accessUrlResult[0]._id.toString()) != -1) {
            return true;
        }
        return false;
    }
    
    return false;
  }
  // 获取权限列表方法
  async getAuthList(role_id) {
    /**
     * 1.获取全部权限
     * 2.查询当前角色拥有的权限（查询当前角色的权限id）把查找到的数据放在数组中
     * 3.循环遍历所有的权限数据  判断当前权限是否在角色权限的数组中  如果在角色权限的数组中：选中   如果不在角色权限的数组中：不选中
     */
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
	
	return result;

  }
}

module.exports = AdminService;