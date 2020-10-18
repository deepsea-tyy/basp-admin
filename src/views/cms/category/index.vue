<template>
  <div class="app-container">

    <el-button type="primary" @click="add(false,{})"><i class="el-icon-plus" />{{ $t('common.add') }}</el-button>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>


    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <Form ref="form" :model="model" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
          <FormField name="name" label="分类名称:">
            <TextBox v-model="model.name" input-id="name" name="name" />
          </FormField>
          <!-- <FormField name="name" label="排序:">
            <NumberBox v-model="model.sort" name="sort" />
          </FormField>
          <FormField name="name" label="状态:">
            <ComboBox v-model="model.status" input-id="c1" :data="status" />
          </FormField> -->
          <FormField>
          <LinkButton style="margin-right: 20px" @click="verificationData()">{{ $t('common.confirm') }}</LinkButton>
          <LinkButton @click="dialogVisible = false">取 消</LinkButton>
          </FormField>
        </Form>
    </el-dialog>
  </div>
</template>
<script>
import * as apiCategory from '@/api/cms/articleCategory'
export default {
  data() {
    return {
      title: '',
      dialogVisible: false,
      status: [
        { value: '1', text: '显示' },
        { value: '2', text: '隐藏' }
      ],
      treeData: [],
      defaultProps: {
        // children: 'children',
        label: 'name'
      },
      model: {},
      rules: {
        name: 'required'
      },
      errors: {},
      editingModel: null,
    }
  },
  created() {
    // this.pagingData(this.pageNumber, this.pageSize)
    this.getTreeData()
    this.initModel();
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        sort: null,
        status: null,
        image_id: null,
        parent_id: null,
        type_id: null,
        image: {
          id: 0,
          file_url: ""
        }
      }
    },

    add(node, data) {
      this.title = '新增'
      this.dialogVisible = true
      this.editingModel = null
      this.node = node
      this.initModel()
      if (data) {
        this.model.parent_id = data.id
      }
    },

    edit(node, data) {
      this.title = '修改'
      this.dialogVisible = true
      this.node = node
      this.model = data
      this.editingModel = data
    },

    delete(node, data) {
      this.model = data
      this.node = node
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(this.model)
        const parent = this.node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      })
    },

    verificationData() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.add(node,data) }>新增</el-button>
            <el-button size="mini" type="text"></el-button>
            <el-button size="mini" type="text" on-click={ () => this.delete(node, data) }>删除</el-button>
          </span>
        </span>);
    },
    async deleteData(data) {
      let res = await apiCategory.del(data)
      this.$message({
        type: res.status == 200 ? "success" : "error",
        message: res.message
      })
    },
    async getTreeData(id = null) {
      const res = await apiCategory.getTree({ id: id })
      this.treeData = res.data
    },
    async saveData(data) {
      let res
      if (this.editingModel) {
        res = await apiCategory.update(data)
      } else {
        res = await apiCategory.add(data)
        this.getTreeData();
      }
      this.$message({
        type: res.status == 200 ? "success" : "error",
        message: res.message
      })
      this.dialogVisible = false
    },
  }
}

</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
