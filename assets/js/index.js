// 入口函数
$(function () {
    // 获取用户信息,调用getUserInof()方法
    getUserInof();

    // 退出登录
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        //eg1
        layer.confirm('确定要退出登录吗？', { icon: 3, title: '提示' }, function (index) {
            // 清空本地token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
            //do something
            layer.close(index);
        });
    });
});

// 获取用户信息(封装到入口函数的外面)  原因  后面有其他的页面也要使用
function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        data: {},
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功 ,渲染头像
            renderAvatar(res.data)
        },

    });
};

function renderAvatar(user) {
    // 渲染名称
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎 &nbsp;&nbsp;&nbsp;' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        // 有头像隐藏文字头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没有头像隐藏图片头像显示文字头像
        $('.layui-nav-img').hide();

        $('.text-avatar').show().html(name[0].toUpperCase());
    };
};