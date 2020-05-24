// 用户Model
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    let d = new Date();

    const AdminSchema = new Schema({
        username: {type: String},
        password: {type: String},
        mobile: {type: String},
        email: {type: String},
        status: {type: Number, default: 1},
        role_id: { // 角色id
            type: Schema.Types.ObjectId
        }, 
        add_time: {
            type: Number,
            default: d.getTime()
        },
        is_super: { // 是否是超级管理员 1-是 0-不是 （超级管理员的作用是登录后台系统，不需要验证角色，他有所有的权限）
            type: Number, 
            default: 0
        }
    });

    return mongoose.model('Admin', AdminSchema, 'admin');
};