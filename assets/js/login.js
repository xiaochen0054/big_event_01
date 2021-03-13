// 入口函数
$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登陆,显示登录区,隐藏注册区
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义验证规则
    let form = layui.form;
    // 密码规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value, itme) {
            // 获取重复密码的val值
            // console.log($('.reg-box input[name=password]').val(););
            if (value != $('.reg-box input[name=password]').val()) {
                return '两次密码输入一致'
            }
        }
    });

    // 注册功能
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发生ajax
        $.ajax({
            url: 'http://api-breakingnews-web.itheima.net/api/reguser',
            type: 'post',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: function (res) {
                console.log(res);
                // 返回状态判断
                if (res.status != 0) {
                    // return alert(res.message);
                    return layer.msg(res.message, { icon: 5 })
                }
                // alert('注册成功')
                layer.msg('注册成功', { icon: 6 })
                // 切换回登陆模块
                $('#link_login').click();
                // 表单清空
                $('#form_reg')[0].reset();
            }
        })
    })

    // 登陆功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // 发生ajax
        $.ajax({
            url: '/api/login',
            type: 'post',
            data:
                $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // 效验状态判断
                if (res.status !== 0) {
                    // return alert(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('登陆成功')
                // 保存token 未来的借口要使用token
                localStorage.setItem('token', res.token);

                // 跳转
                location.href = '/index.html';
            }
        })
    })






})