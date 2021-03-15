$(function () {
    // 效验规则定义
    let form = layui.form;

    form.verify({
        nickname: function (value) {
            if (value.length < 1 || value.length > 6) {
                return '昵称长度为1~6位之间'
            }
        }
    });

    // 用户渲染
    initUserInfo();
    // 导出layer
    let layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        // 发送ajax
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                };
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 用上面的用户渲染方法实现
        initUserInfo();
    });

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止浏览器默认行为,form表单的提交
        e.preventDefault();
        // 发送ajax,修改用户信息
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('用户信息修改失败')
                }
                layer.msg('恭喜您,用户信息修改成功')
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInof()
            }
        })
    })
});