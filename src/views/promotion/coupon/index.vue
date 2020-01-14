<template>
  <div class="app-container">

    <LinkButton style="width:80px;margin-bottom:4px" @click="createRow()"><i class="el-icon-plus" />{{ $t('common.add') }}</LinkButton>
    <el-button type="primary" @click="batchDelete">{{ $t('common.delete') }}</el-button>

    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :page-number="queryParam.pageNumber" :page-size="queryParam.pageSize" style="margin-top: 10px;" @pageChange="onPageChange($event)">
      <GridColumnGroup :frozen="true" align="left" width="150">
        <GridHeaderRow>
          <GridColumn field="xuhao" title="#" align="center" cell-css="datagrid-td-rownumber">
            <template slot="body" slot-scope="scope">
              {{ scope.rowIndex + 1 }}
            </template>
          </GridColumn>
          <GridColumn field="ck" align="center">
            <template slot="header" slot-scope="scope">
              <CheckBox v-model="allChecked" @checkedChange="onAllCheckedChange($event)"></CheckBox>
            </template>
            <template slot="body" slot-scope="scope">
              <CheckBox v-model="scope.row.selected" @checkedChange="onCheckedChange($event)"></CheckBox>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
      <GridColumnGroup>
        <GridHeaderRow>
          <GridColumn field="name" title="名称" align="center"  width="150"/>
          <GridColumn field="receive_num" title="可领次数" align="center"  width="150"/>
          <GridColumn field="code" title="调用代码" align="center"  width="150"/>
          <GridColumn field="status" title="状态" align="center"  width="150"/>
          <GridColumn field="exclusion" title="排他" align="center"  width="150"/>
          <GridColumn field="type" title="类型" align="center"  width="150">
            <template slot="body" slot-scope="scope">
              {{scope.row.type}}
            </template>
          </GridColumn>

          <GridColumn field="created_at" title="添加时间" align="center" width="150">
            <template slot="body" slot-scope="scope">
              {{ funs.formatTime(scope.row.created_at * 1000,2) }}
            </template>
          </GridColumn>
          <GridColumn field="updated_at" title="更新时间" align="center" width="150">
            <template slot="body" slot-scope="scope">
              {{ funs.formatTime(scope.row.updated_at * 1000,2) }}
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
      <GridColumnGroup :frozen="true" align="right" width="80">
        <GridHeaderRow>
          <GridColumn field="act" title="操作" align="center">
            <template slot="body" slot-scope="scope">
              <ButtonGroup style="height:24px">
                <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
                <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
              </ButtonGroup>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
    </DataGrid>


    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :rules="rules" @validate="errors=$event" style="padding:20px 50px">
        <FormField name="name" label="名称:">
          <TextBox inputId="name" name="name" v-model="model.name"></TextBox>
        </FormField>

        <FormField>
          <LinkButton @click="verificationRow()" style="margin-right: 20px">{{$t('common.confirm')}}</LinkButton>
          <LinkButton @click="dialogVisible=false">{{$t('common.cancel')}}</LinkButton>
        </FormField>
      </Form>
    </el-dialog>
  </div>
</template>
<script>
import * as apiPromotion from '@/api/promotion/promotion'

export default {
  data() {
    return {
      total: 0,
      tableList: [],
      loading: false,
      queryParam: {
        page: 1,
        pageSize: 20,
        type: 1
      },
      allChecked: false,
      rowClicked: false,
      dialogVisible: false,
      dialogType: '',
      errors: {},
      model: {},
      rules: {
        name: 'required'
      },
    }
  },
  created() {
    this.pagingData(this.queryParam)
  },
  computed: {
    checkedRows() {
      return this.tableList.filter(row => row.selected);
    }
  },
  methods: {
    initModel() {
      this.model = {
        name: null,
        sort: null,
      }
    },
    batchDelete(){
      let ids = this.checkedRows.map((item) => {
        return item.id
      })
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({id:ids});
      })
    },
    onAllCheckedChange(checked) {
      if (this.rowClicked) {
        return;
      }
      this.tableList = this.tableList.map(row => {
        return Object.assign({}, row, {
          selected: checked
        });
      });
    },
    onCheckedChange(checked) {
      this.allChecked = this.checkedRows.length === this.tableList.length;
      this.rowClicked = true;
      this.$nextTick(() => (this.rowClicked = false));
    },
    onQuery() {
      this.pagingData(this.queryParam)
    },
    onPageChange(event) {
      this.queryParam.page = event.pageNumber
      this.pagingData(this.queryParam)
    },
    verificationRow() {

    },
    createRow() {
      this.initModel()
      this.editingModel = null
      this.dialogType = 'add'
      this.dialogVisible = true
    },
    updateRow(row) {
      this.editingModel = row;
      this.model = Object.assign({}, row);
      this.dialogType = 'edit';
      this.dialogVisible = true
    },
    deleteRow(row) {
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      })
    },
    async pagingData(param) {
      this.loading = true
      let res = await apiPromotion.getList(param)
      this.total = res.data.totalCount
      this.tableList = res.data.list
      this.loading = false
    },
    async saveData(data, type = 1) {
      if (type == 1) {
        await apiPromotion.update(data)
      } else {
        await apiPromotion.add(data)
      }
    },
    async deleteData(data) {
      await apiPromotion.del(data)
      this.pagingData(this.pageNumber, this.pageSize)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    }
  }
}

</script>
