$(function() {
    // alert(123)
    var layer = layui.layer;
    var form = layui.form;
    //获取文章列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res);
                // if (res.code !== 0) {
                //     return layer.msg('获取文章分类列表失败')
                // }
                //请求成功调用模板引擎，将返回的数据渲染到页面
                var strhtml = template('tpl-table', res)
                $('tbody').html(strhtml)
            }
        })
    }
    //点击添加类别，弹出弹出框，发送请求，渲染页面
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                //直接在js中绘制页面比较麻烦，所以利用模板引擎渲染
                content: $('#dialog-add').html()
            });
        })
        //为添加类别进行事件委托提交事件，发送请求，渲染页面
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/cate/add',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    if (res.code !== 0) {
                        return layer.msg('新增文章分类失败')
                    }
                    layer.msg('新增文章分类成功');
                    initArtCateList();
                    layer.close(indexAdd)
                }
            })
        })
        //点击编辑按钮，弹出一个弹出框，
    var indexEdit = null;
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            //直接在js中绘制页面比较麻烦，所以利用模板引擎渲染
            content: $('#dialog-edit').html()
        });
        //根据id 获取到当前修改的文章列表
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/cate/info?id=' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    });
    //为修改文章分类添加提交事件，发请求，渲染文章分类列表(事件委托)
    //注意点：修改按钮可以绑定在tbody身上，但是弹出的表单是绑定在body里面，所以要绑定body
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'put',
                url: '/my/cate/info',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(123);
                    if (res.code !== 0) {
                        return layer.msg('修改文章分类失败')
                    }
                    layer.msg('修改文章分类成功')

                    layer.close(indexEdit)
                    initArtCateList()
                }

            })
        })
        //点击删除按钮，弹出layer.confirm
    var indexDelete = null;
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        indexDelete = layer.confirm('确认删除?', { icon: 3, title: '提示' }, function() {
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id=' + id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(indexDelete)
                    initArtCateList()
                }
            })
        })
    })
})