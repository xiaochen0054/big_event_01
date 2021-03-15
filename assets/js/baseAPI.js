// 服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net';

// 拦截所有ajas请求: get / post / ajax;
// 处理参数
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;

    // 身份认证
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        // 拦截所有响应,判断身份认证信息  (登录拦截)
        params.complete = function (res) {
            // console.log(res);
            let obj = res.responseJSON;
            if (obj.status == 1 && obj.message == "身份认证失败!") {
                // 清空本地token
                localStorage.removeItem('token');
                // 页面跳转
                location.href = '/login.html';
            }
        }
    }

});