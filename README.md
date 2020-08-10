# basp-admin


## 简介
后台管理

## 开发

```bash

# 进入项目目录
cd basp-admin

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
## 开发规范
- CURD规范 具体查看页面代码
```bash

export default {
  data() {
    return {
      # 页面模型
      model: {},
      # 用于区分当前操作
      editingModel: null,
	  # 页面DataGrid分页设置
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      tableList: [],
      # 子组件渲染状态
      cmtResetHandle: 1
    }
  },
  watch: {
    # 子组件重置渲染
    "model":function () {
      ++this.cmtResetHandle
    }
  },
  created() {
  	# 页面初始化
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize)
  },
  methods: {
    initModel() {},
    # 分页数据
    onPageChange(){},
    # 行数据操作
    createRow() {},
    updateRow(row) {},
    deleteRow(row) {},
    # 行数据验证
    verificationRow() {},
    # api数据请求
    async pagingData(pageNumber, pageSize) {},
    async saveData(data) {},
    async deleteData(data) {},
    async viewData(data) {}
  }
}
```
![image](https://github.com/deepsea-tyy/basp-admin/blob/master/WX20200518-091041.png)
