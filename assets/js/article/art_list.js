$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //先定义一个查询参数，后面发送请求的时候需要提供这个参数
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: ''
    }
    initTable() //调用获取列表区域数据的函数
    initCate() //调用获取文章分类的函数

    //定义时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var h = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    };
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //发请求获取文章分类列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取文章列表数据成功')
                } //利用模板引擎渲染页面
                var strhtml = template('tpl-table', res)
                $('tbody').html(strhtml);
                //获取完数据之后渲染分页
                renderPage(res.total)
            }
        })
    }
    //发请求获取下拉分类列表
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类信息失败')
                }
                //调用模板引擎函数
                var strhtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strhtml);
                //虽然通过模板引擎渲染页面，但是layui表单接收不到这个信息，所以需要调用form.render()
                form.render()
            }
        })
    }
    //为筛选表单绑定事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            //获取筛选的条件，并将其赋给参数q,然后调用获取列表数据的函数就可以了
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val();
            q.cate_id = cate_id;
            q.state = state;
            initTable() //调用获取列表区域数据的函数
        })
        //渲染文章分页区域
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中那一页
            //设置分页区域的其他效果用layout
            layout: ['count', 'limit', 'prev', 'page', 'next'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        });
    }
    //点击删除按钮发送请求删除文章
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        // console.log(123);
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'delete',
                url: '/my/article/info?id=' + id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除信息失败')
                    }
                    layer.msg('删除信息成功');
                    layer.close(index);
                    //注意点：bug:如果我们将当前的页面删除完了之后，页码虽然会有更新，但是跳转到的相应页面并没有更新文章内容,所以需要进行判断
                    //1.如果点击删除，当前删除个数不等于1，意思是还有数据，那么页码值不变化，、
                    // 2.如果删除按钮的个数等于1，说明删除成功之后页面就没有数据了，此时页码值需要减1；
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
        })
    })
})