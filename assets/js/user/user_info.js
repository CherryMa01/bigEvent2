$(function() {
    //表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });
    initUserInfo();
    //发送ajax请求获取初始化页面基本信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取用户基本信息失败')
                }
                console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }
    //点击重置按钮，阻止表单的默认行为，并且重新渲染页面
    $('#btnReset').on('click', function(e) {
            e.preventDefault();
            initUserInfo();
        })
        //监听表单的提交事件，发起请求，重新获取初始化页面信息
    $('.layui-form').on('submit', function(e) {
        console.log(123);
        e.preventDefault();
        $.ajax({
            method: 'put',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('修改用户信息失败')
                }

                layer.msg('修改用户信息成功');
                //修改用户信息成功之后，用户名和昵称那里相应改变
                //调用父页面index.js里面的初始化用户信息的函数
                window.parent.getUserInfo()
            }
        })
    })
})