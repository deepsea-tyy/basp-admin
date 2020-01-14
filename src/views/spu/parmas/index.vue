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
        <FormField name="name" label="参数名称:">
          <TextBox v-model="model.name" input-id="name" name="name" />
        </FormField>
        <FormField name="name" label="排序:">
          <NumberBox v-model="model.sort" name="sort" />
        </FormField>
        <FormField name="name" label="参数类型:">
          <ComboBox v-model="model.type" input-id="c1" :data="type" />
        </FormField>
        <FormField name="params" label="参数值:">
          <table>
            <thead>
              <tr>
                <th>描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in model.value">
                <td>
                  <TextBox v-model="model.value[index]" name="value[]" />
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
import * as apiParam from '@/api/spu/param'
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
          required: '参数名称必填.'
        }
      },
      errors: {},
      editingModel: null,
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      tableList: [],
      type: [
        { value: 'text', text: '文本框' },
        { value: 'radio', text: '单选' },
        { value: 'checkbox', text: '复选框' }
      ],
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
        value: ['']
      }
    },
    addInput() {
      this.model.value.push('')
    },
    removeInput(index) {
      if (this.model.value.length > 1) {
        this.model.value.splice(index, 1)
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
      // console.log(row);return;
      this.model = Object.assign({}, row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.editingModel = row
    },
    verificationRow() {
      this.$refs.form.validate(errors => {
        if (!errors) {
          const newRow = Object.assign({}, this.model)
          if (this.editingModel) {
            this.saveData(this.model)
            this.editingModel = null
          } else {
            this.saveData(this.model, 2)
          }
        }
      })
    },
    deleteRow(row) {
      this.$messager.confirm({
        // title: '删除',
        msg: '确定删除此数据?',
        result: (r) => {
          if (r) {
            this.deleteData(row)
            this.pagingData(this.pageNumber, this.pageSize)
          }
        }
      })
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true
      const result = await apiParam.getList({ page: pageNumber, pageSize: pageSize })
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async saveData(data, type = 1) {
      if (type == 1) {
        await apiParam.update(data)
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiParam.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiParam.del(data)
    }
  }
}

</script>
