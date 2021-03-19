$(function () {
    // 1 初始化分类
    let form = layui.form;  //导入form
    let layer = layui.layer;    //导入layer
    initCate();     //调用函数
    // 封装函数
    function initCate() {
        // console.log(111);
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate', res);
                // console.log(res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        })
    }

    //2 初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    let $image = $('#image')
    // 3.2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5.设置图片
    $('#coverFile').change(function (e) {
        // 拿到用户选择的文件
        let file = e.target.files[0]

        // 非空校验
        if (file == undefined) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6设置状态

    let state = '';
    $("#btnSave1").on("click", function () {
        state = '已发布';
    })
    //  let state = '已发布';  //一样可以
    $("#btnSave2").on("click", function () {
        state = '草稿';
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建 formData 对象 收集数据
        let fd = new FormData(this)
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发送 ajax 要在 toBlob()函数里面
                publishArticle(fd);
                // console.log(...fd);
            });
    })

    // 封装  添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('发布成功!');
                // 页面跳转
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1000)
            }
        })
    }
})