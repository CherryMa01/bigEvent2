$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 初始化富文本编辑器
    initEditor();
    //调用渲染文章类别的下拉框函数
    initCate()
        //渲染文章类别的下拉框
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                var strhtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strhtml)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    //4.点击选择封面，弹出隐藏的文件选择框

    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        //5.监听文件选择框的change事件，将选择的图片设置成裁剪区域的图片
    $('#coverFile').on('change', function(e) {
            var file = e.target.files[0]
            var newImgURL = URL.createObjectURL(file)
                // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域a
        })
        //点击发布和存为草稿，进行相应的操作
    var art_state = null;
    $('#btnPublish').on('click', function() {
        art_state = '已发布'
    })
    $('#btnSave').on('click', function() {
            art_state = '草稿'
        })
        //表单的提交
    $('#form-pub').on('submit', function(e) {
            //1.阻止默认行为
            e.preventDefault();
            //2.通过创建formDate的方式提交
            var fd = new FormData($(this)[0])
                // console.log(fd); //打印不出来，需要循环//包括标题，类别，内容
                // fd.forEach(function(v, k) {
                //     console.log(v, k);
                // })
            fd.append('state', art_state)
                // 将封面裁剪过后的图片，输出为一个文件对象（cover_img）
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5. 将文件对象，存储到 fd 中
                    fd.append('cover_img', blob);
                    //调用函数
                    publishArticle(fd);
                });
        })
        //6.发起发布文章的ajax请求   
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('文章发布失败')
                }
                layer.msg('文章发布成功');
                location.href = '/article/art_list.html'
            }
        })
    }
})