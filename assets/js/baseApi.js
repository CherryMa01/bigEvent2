$(function() {
    //当我们每次发起$.get(),$.post(),$.ajax()的时候会先调用$.ajaxPrefilter这个函数
    $.ajaxPrefilter(function(options) {
        options.url = 'http://www.liulongbin.top:3008' + options.url;

    })
})