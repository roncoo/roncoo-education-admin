/**
 * 表单封装
 */
import {onMounted, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';

export default function Table(apis: any, PageParam = {}) {
    // 列表搜索项目对象
    const seekForm: any = reactive({})
    const tableData = reactive({
        loading: true,
        list: []
    })

    // 列表数据
    const getTableData = async () => {
        tableData.loading = true;
        const res = await apis.getList({
            pageCurrent: page.pageCurrent,
            pageSize: page.pageSize,
            ...PageParam,
            ...seekForm
        });
        tableData.loading = false;
        tableData.list = res.list || []
        page.totalCount = res.totalCount || 0;
    }

    // 搜索函数
    const seek = () => {
        page.pageCurrent = 1;
        getTableData();
    };

    // 重置
    const resetSeek = () => {
        for (let i in seekForm) {
            seekForm[i] = '';
        }
        seek()
    };

    // 分页对象
    const page = reactive({
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSizes: [20, 50, 100, 200]
    });
    // 分页函数
    const handleSizeChange = (size: number) => {
        page.pageSize = size;
        getTableData();
    };

    // 分页函数
    const handleCurrentChange = (pageCurrent: number) => {
        page.pageCurrent = pageCurrent;
        getTableData();
    };

    // 列表删除项目
    const tableDelete = (data: any, tip: string) => {
        if (apis.delete) {
            ElMessageBox.confirm(tip || '确认删除当前数据?', '提示', {
                type: 'warning',
                cancelButtonText: '取消',
                confirmButtonText: '确认'
            }).then(async () => {
                const res = await apis.delete({id: data.id});
                ElMessage({type: 'success', message: res.msg});
                await getTableData();
            });
        }
    };

    // 添加弹窗显示 数据交互对象
    const addModel = reactive({
        visible: false,
        form: {}
    });
    // 打开添加弹窗
    const openAddDialog = (item: any) => {
        addModel.form = item || {};
        addModel.visible = true;
    };
    // 关闭添加弹窗 并刷新列表
    const closeAddDialog = () => {
        addModel.visible = false;
        page.pageCurrent = 1;
        getTableData();
    };

    // 编辑弹窗显示 数据交互对象
    const editModel = reactive({
        visible: false,
        form: {}
    });
    // 打开编辑弹窗
    const openEditDialog = (item: any) => {
        editModel.form = item || {};
        editModel.visible = true;
    };
    // 关闭编辑弹窗 并刷新列表
    const closeEditDialog = () => {
        editModel.visible = false;
        getTableData();
    };


    // 获取数据
    onMounted(getTableData);

    return {
        PageParam,
        tableData,
        seekForm,
        page,
        addModel,
        editModel,
        seek,
        resetSeek,
        getTableData,
        tableDelete,
        handleCurrentChange,
        handleSizeChange,
        openAddDialog,
        closeAddDialog,
        openEditDialog,
        closeEditDialog
    };
}
