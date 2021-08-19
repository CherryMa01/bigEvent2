$(function() {
    getUserInfo()
        // alert(123)
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
            // alert(123);
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 1. 退出登录需要清空本地存储中的 token（登录的时候保存了token）
                localStorage.removeItem('token')
                    // 2. 重新跳转到登录页面
                location.href = '/login.html'
                    // 关闭 confirm 询问框
                layer.close(index);
            })
        })
        //发请求获取用户信息（后面渲染用户信息）


    function getUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            // headers: { Authorization: localStorage.getItem('token') || '' }已经写入baseApi里面
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                //执行文字头像和图片头像的渲染功能
                renderAvatar(res.data)
            }
        })
    }

    function renderAvatar(user) {
        var name = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            //2.渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase(); //用户名或者昵称的第一个大写字母
            $('.text-avatar').html(first).show();
        }
    }
});