import {onMounted, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import Sortable from 'sortablejs';

export default function UseTable(apis = {}, PageParam = {}) {
  // 获取列表数据
  let tableData = reactive({
    loading: true,
    list: []
  });

  const getTableData = async() => {
    if (apis.getList) {
      try {
        tableData.loading = true;
        const data = await apis.getList({
          pageCurrent: page.pageCurrent,
          pageSize: page.pageSize,
          ...PageParam,
          ...seekForm
        });
        tableData.loading = false;
        if (data) {
          tableData.list = Array.isArray(data) ? data : data.list || [];
          page.totalCount = data.totalCount || 0;
        } else {
          tableData.list = [];
        }
        if (apis.changeSort) {
          rowDrop();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  // 列表搜索项目对象
  const seekForm = reactive({
    //name: "",
  });
  // 搜索函数
  const seek = () => {
    page.pageCurrent = 1;
    getTableData();
  };
  const resetSeek = () => {
    //seekForm.name = '';
    for (let i in seekForm) {
      seekForm[i] = '';
    }
    seek()
  };

  // 分页对象信息
  const page = reactive({
    pageCurrent: 1,
    pageSize: 20,
    totalCount: 0,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [20, 50, 100, 200]
  });
  // 分页函数
  const handleSizeChange = (size) => {
    page.pageSize = size;
    getTableData();
  };

  // 分页函数
  const handleCurrentChange = (pageCurrent) => {
    page.pageCurrent = pageCurrent;
    getTableData();
  };

  // 列表删除项目
  const tableDelete = (data, tip) => {
    if (apis.delete) {
      ElMessageBox.confirm(tip || '确认删除当前项目?', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认'
      }).then(async() => {
        try {
          const d = await apis.delete({
            id: data.id,
            ...data
          });
          if (d) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            });
            getTableData();
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  // 添加弹窗显示 数据交互对象
  const addModel = reactive({
    visible: false,
    form: {}
  });
  // 打开添加弹窗
  const openAddDialog = (item) => {
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
  const openEditDialog = (item) => {
    editModel.form = item || {};
    editModel.visible = true;
  };
  // 关闭编辑弹窗 并刷新列表
  const closeEditDialog = () => {
    editModel.visible = false;
    getTableData();
  };

  //需要拖拽的表格需要加.drop_table
  const rowDrop = () => {
    const tbody = document.querySelector(
      '.drop_table .el-table__body-wrapper tbody'
    );
    if (!tbody) return;
    Sortable.create(tbody, {
      onEnd: ({newIndex, oldIndex}) => {
        const targetRow = tableData.list.splice(oldIndex, 1)[0];
        tableData.list.splice(newIndex, 0, targetRow);
        if (newIndex === oldIndex) return
        const sortList = tableData.list.map(item => {
          return item.sort
        })
        const max = Math.max(...sortList)
        tableData.list.forEach((item, index) => {
          item.sort = max - index
        })
        changeSort();
      }
    });
  };
  //排序函数
  const changeSort = async() => {
    const sortList = tableData.list.map((el, index) => {
      return {
        id: el.id,
        sort: el.sort
      };
    });
    if (apis.changeSort) {
      tableData.loading = true
      const result = await apis.changeSort(sortList);
      if (result) {
        ElMessage.success(result);
        tableData.list = []
        getTableData();
      }
      tableData.loading = false
    }
  };
  //更新状态

  // 获取数据
  onMounted(getTableData);

  return {
    tableData,
    seekForm,
    PageParam,
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
