$(function () {
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能和原密码一致!'
            }
        },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '两次输入密码不一致!'
            }
        }
    })

    // 修改密码
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            method: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.massage);
                }
                $('form')[0].reset();
                return layui.layer.msg('密码修改成功');
            }
        })
    })
})