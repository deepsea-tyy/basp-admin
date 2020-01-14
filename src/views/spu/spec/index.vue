<template>
  <div class="app-container">
    <LinkButton style="width:80px;margin-bottom:4px" @click="createRow()"><i class="el-icon-plus" />{{ $t('common.add') }}</LinkButton>
    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :page-number="pageNumber" :page-size="pageSize" @pageChange="onPageChange($event)">
      <GridColumn align="center" cell-css="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{ scope.rowIndex + 1 }}
        </template>
      </GridColumn>
      <GridColumn field="name" title="名称" align="center" />
      <GridColumn field="sort" title="排序" align="center" />
      <GridColumn field="act" title="操作" align="center" width="100">
        <template slot="body" slot-scope="scope">
          <ButtonGroup style="height:24px">
            <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
            <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
          </ButtonGroup>
        </template>
      </GridColumn>
    </DataGrid>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :messages="messages" :rules="rules" style="padding:20px 20px" @validate="errors=$event">
        <FormField name="name" label="属性名称:">
          <TextBox v-model="model.name" input-id="name" name="name" />
        </FormField>
        <FormField name="sort" label="排序:">
          <NumberBox v-model="model.sort" input-id="sort" name="sort" />
        </FormField>
        <FormField name="params" label="属性值:">
          <table>
            <thead>
              <tr>
                <th>描述</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in model.items">
                <td>
                  <TextBox v-model="item.value" name="items[value][]" />
                </td>
                <td>
                  <NumberBox v-model="item.sort" name="items[sort][]" />
                </td>
                <td width="100px">
                  <LinkButton @click="addInput()"><i class="el-icon-plus" /></LinkButton>
                  <LinkButton @click="removeInput(index)"><i class="el-icon-delete" /></LinkButton>
                </td>
              </tr>
            </tbody>
          </table>
        </FormField>
        <FormField>
          <LinkButton style="margin-right: 20px" @click="verificationRow()">{{ $t('common.confirm') }}</LinkButton>
          <LinkButton @click="dialogVisible=false">{{ $t('common.cancel') }}</LinkButton>
        </FormField>
      </Form>
    </el-dialog>
  </div>
</template>
<script>
import * as apiSpec from '@/api/spu/spec'

export default {
  data() {
    return {
      title: '',
      model: {},
      rules: {
        name: 'required'
      },
      messages: {
        name: {
          required: '属性名称必填.'
        }
      },
      errors: {},
      editingModel: null,
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      tableList: [],
      loading: false,
      dialogVisible: false,
      dialogType: ''
    }
  },
  created() {
    this.initModel()
    this.pagingData(this.pageNumber, this.pageSize)
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        sort: null,
        items: [{
          value: null,
          sort: null,
          key: null
        }]
      }
    },
    addInput() {
      this.model.items.push({})
    },
    removeInput(index) {
      if (this.model.items.length > 1) {
        this.model.items.splice(index, 1)
      }
    },
    formatText(value) {
      return value
    },
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize)
    },
    createRow() {
      this.initModel()
      this.editingModel = null
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    updateRow(row) {
      this.viewData(row)
      this.editingModel = row
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          this.saveData(this.model)
        }
      })
    },
    deleteRow(row) {
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
        this.pagingData(this.pageNumber, this.pageSize)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiSpec.getList({ page: pageNumber, pageSize: pageSize })
      // console.log(result.data);
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiSpec.update(data)
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiSpec.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiSpec.del(data)
    },
    async viewData(row) {
      const res = await apiSpec.view(row)
      this.model = Object.assign({}, res.data)
      if (this.model.items.length == 0) {
        this.model.items = [{
          value: null,
          sort: null,
          key: null
        }]
      }
      this.dialogType = 'edit'
      this.dialogVisible = true
    }
  }
}

</script>
