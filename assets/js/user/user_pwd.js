$(function() {
    var form = layui.form;
    var layer = layui.layer;
    //表单的验证
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            samepwd: function(value) {
                if (value === $('[name=old_pwd]').val()) {
                    return '新旧密码不能相同！'
                }
            },
            repwd: function(value) {
                if (value !== $('[name=new_pwd]').val()) {
                    return '两次密码输入不一致'
                }
            }
        })
        //表单提交发起请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'patch',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);\
                if (res.code !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                $('.layui-form')[0].reset();
            }
        })
    })

})