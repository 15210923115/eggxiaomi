module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    let d = new Date();

    const AccessSchema = new Schema({
        module_name: {
            type: String // 模块名称
        },
        action_name: {
            type: String // 操作名称
        },
        type: {
            type: Number // 节点类型：1-模块 2-菜单 3-操作
        },
        url: { // 菜单或者操作需要访问的地址
            type: String
        },
        module_id: { // 此module_id和当前模型的_id关联（这是一个自关联的表）  module_id == 0 表示模块
            type: Schema.Types.Mixed // 混合类型
        },
        sort: {
            type: Number,
            default: 100
        },
        description: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        },
        add_time: {
            type: Number,
            default: d.getTime()
        }
    });
    
    return mongoose.model("Access", AccessSchema, 'access');
};