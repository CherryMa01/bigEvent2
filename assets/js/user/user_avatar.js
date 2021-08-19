$(function() {
    var layer = layui.layer;
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
    $image.cropper(options);
    //点击上传按钮，弹出文件筐，选择图片
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    });
    //监听file的change事件
    $('#file').on('change', function(e) {
            var files = e.target.files;
            if (files.length === 0) {
                return layer.msg('请选择照片')
            } //选择照片之后执行后续的逻辑
            // 1. 拿到用户选择的文件
            var file = e.target.files[0]
                // 2. 将文件，转化为路径
            var imgURL = URL.createObjectURL(file)
                // 3. 重新初始化裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //为确定按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        //将用户裁剪之后的新头像转换成64位的字符串，后面发起上传头像请求的时候需要携带这个参数
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功')
                    //头像更换成功之后，渲染父页面index.js里面的初始化用户信息的函数，渲染头像
                window.parent.getUserInfo()
                console.log(123);
            }
        })
    })
})