$(function() {
    //模块一：点击注册登录，实现跳转
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide()
    })
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show()
    })
    var form = layui.form;
    var layer = layui.layer;
    //模块二：表单的验证
    form.verify({
            //密码的验证
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            //再次输入密码的验证
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        //注册页面表单提交发起ajax请求
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            var data = {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
                repassword: $('.reg-box [name=repassword]').val()
            }
            $.ajax({
                method: 'post',
                url: '/api/reg',
                data: data,
                success: function(res) {
                    console.log(res);
                    if (res.code !== 0) {
                        return layer.msg('注册失败')
                    }
                    layer.msg('注册成功，请登录')
                    $('#link_login').click()
                }
            })
        })
        //登录页面发起ajsx请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录')
                    //登陆成功之后保存 token值，因为后续访问有权限的接口需要使用
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})