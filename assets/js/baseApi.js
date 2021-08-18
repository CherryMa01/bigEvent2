$(function() {
    //当我们每次发起$.get(),$.post(),$.ajax()的时候会先调用$.ajaxPrefilter这个函数
    $.ajaxPrefilter(function(options) {
        //拼接url
        options.url = 'http://www.liulongbin.top:3008' + options.url;
        //携带请求头，请求有权限的接口的时候需要这个参数，
        if (options.url.indexOf('/my') !== -1) {
            options.headers = { Authorization: localStorage.getItem('token') || '' }
        }
        options.complete = function(res) {
            // console.log(res);//不通过登录页面直接访问页面会显示如下信息
            if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html'
            }
        }
    })
})