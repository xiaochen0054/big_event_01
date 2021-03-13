// 服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net';

// 拦截所有ajas请求: get / post / ajax;
// 处理参数
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;
});