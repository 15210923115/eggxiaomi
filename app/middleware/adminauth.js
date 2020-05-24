const url = require('url');

module.exports = options => {
    return async function adminauth(ctx, next) {
        // 1.用户没有登录，跳转到登录页面
        // 2.只有登录以后才可以访问后台管理系统

        ctx.state.csrf = ctx.csrf; // 全局变量（用于解决post提交数据时的安全性问题）
        
        ctx.state.prevPage = ctx.request.headers['referer']; // 全局变量（保存上一页的地址）

        let pathname = url.parse(ctx.request.url).pathname;// 过滤get传参的参数
        
        if (ctx.session.userinfo) {
            // 登录了，直接next()往下执行后面的流程
            ctx.state.userinfo = ctx.session.userinfo;
            await next();
        } else {
            // 没有登录，跳转到登录页面
            // 但是需要排除不需要做权限判断的页面，否则无法跳转到登录页面去登录
            if (pathname === '/admin/login' || pathname === '/admin/doLogin' || pathname === '/admin/verify') {
                await next();
            } else {
                ctx.redirect('/admin/login');
            }
        }
    };
};