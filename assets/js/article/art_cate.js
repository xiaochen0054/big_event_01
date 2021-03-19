$(function () {
    // 文章类别列表展示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            data: {},
            success: (res) => {
                // console.log(res);
                let str = template('tpl-art-cate', res);
                $('tbody').html(str);
            }
        })
    }

    // 添加
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    })

    // 添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送AJAS
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 添加成功重新渲染页面
                initArtCateList();
                layer.msg('添加成功')
                layer.close(indexAdd)
            }
        })
    });

    // 编辑
    let indexEdit = null;
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取Id 发送ajax获取数据,渲染到页面
        let Id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + Id,
            method: 'get',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                form.val('form-edit', res.data)
            }
        })
    });

    // 修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送AJAS
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 添加成功重新渲染页面
                initArtCateList();
                layer.msg('修改成功')
                layer.close(indexEdit)
            }
        })
    });

    // 删/除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取Id 发送ajax获取数据,
        let Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                method: 'get',
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    // 添加成功重新渲染页面
                    initArtCateList();
                    layer.msg('删除成功')
                    layer.close(index)
                }
            })
        })
    })
})