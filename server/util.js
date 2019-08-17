// 统一处理api接口返回（成功or失败）
module.exports = {
  handleApiReturn: (ctx, result, msg = 'success') => {
    ctx.body = { result, msg, success: msg === 'success' };
  }
} 
