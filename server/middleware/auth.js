// 登录校验中间件
module.exports = options => {
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../models/AdminUser')

    // 错误处理插件
    const assert = require('http-assert')

    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '没有token，请先登录')

        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '找不到该token，请先登录')

        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '找不到该用户，请先登录')

        await next()
    }
}