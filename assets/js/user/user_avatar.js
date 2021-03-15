$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击按钮选择图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    let layer = layui.layer;
    $('#file').on('change', function (e) {
        let file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return layer.msg('请选择图片!')
        }
        // 根据选择的文件创建一个对应的URL地址
        let imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 上传头像
    $('#btnUpload').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // 发送ajax
        $.ajax({
            url: '/my/update/avatar',
            method: 'post',
            data: { avatar: dataURL },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('上传成功!')
                window.parent.getUserInof();
            }
        })
    })

})
