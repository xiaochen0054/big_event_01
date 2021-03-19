$(function () {
    // 向模板引擎中导入 变量/函数
    template.defaults.imports.dateFormat = function (dateStr) {
        let dt = new Date(dateStr)
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }

    function padZero(num) {
        return num < 10 ? '0' + num : num
    }

    let q = {
        pagenum: 1,      //是	int	页码值
        pagesize: 5,	 //是	int	每页显示多少条数据
        cate_id: '',     //否	string	文章分类的 Id
        state: '',       //否	string	文章的状态，可选值有：已发布、草稿
    }
    // 初始化文章列表
    let layer = layui.layer;

    initTable();
    // 初始化文章列表 因为后面还要用所以要封装成函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'get',
            data: q,
            success: (res) => {
                console.log(res);
                // 判断是否成功返回数据
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 分页
                renderPage(res.total);
            }
        })
    }

    // 初始化分类
    let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let state = $('[name="state"]').val();
        let cate_id = $('[name="cate_id"]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    });

    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //初始化页面 (当前页)

            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            // 页面切换触发这个方法  (实现页码切换数据同步)
            jump: function (obj, first) {
                if (!first) {
                    // 把页码值赋值给q中的pagenum
                    q.pagenum = obj.curr;
                    //每页显示多少条重新赋值
                    q.pagesize = obj.limit;
                    // 重新渲染页面
                    initTable();
                }
            }
        })
    }

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取被点击的ID
        let Id = $(this).attr('data-id');

        layer.confirm('确定要删除此条数据吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功!')
                    // 页面汇总删除按钮个数等于1页码大于一
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    // 重新渲染页面
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})