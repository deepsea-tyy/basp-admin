<template>
  <div class="app-container">
    <LinkButton @click="createRow()" style="width:80px;margin-bottom:4px"><i class="el-icon-plus" />{{$t('common.add')}}</LinkButton>
    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :pageNumber="pageNumber" :pageSize="pageSize" @pageChange="onPageChange($event)">
      <GridColumn align="center" cellCss="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{scope.rowIndex + 1}}
        </template>
      </GridColumn>
      <GridColumn field="name" title="名称" align="center"></GridColumn>
      <GridColumn field="style" title="样式" align="center"></GridColumn>
      <GridColumn field="created_at" title="添加时间" align="center">
        <template slot="body" slot-scope="scope">
          {{funs.formatTime(scope.row.created_at * 1000,2)}}
        </template>
      </GridColumn>
      <GridColumn field="updated_at" title="更新时间" align="center">
        <template slot="body" slot-scope="scope">
          {{funs.formatTime(scope.row.updated_at * 1000,2)}}
        </template>
      </GridColumn>
      <GridColumn field="act" title="操作" align="center" width="100">
        <template slot="body" slot-scope="scope">
          <ButtonGroup style="height:24px">
            <LinkButton>
              <svg-icon icon-class="eye-open" />
            </LinkButton>
            <LinkButton @click="updateRow(scope.row)"><i class="el-icon-edit-outline" /></LinkButton>
            <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
          </ButtonGroup>
        </template>
      </GridColumn>
    </DataGrid>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <Form ref="form" :model="model" :messages="messages" :rules="rules" @validate="errors=$event" style="padding:20px 50px">
        <FormField name="name" label="名称:">
          <TextBox inputId="name" name="name" v-model="model.name"></TextBox>
        </FormField>
        <FormField name="style" label="样式/颜色:">
          <TextBox inputId="style" name="style" v-model="model.style"></TextBox>
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
import * as apiLabel from '@/api/base/lable'
export default {
  data() {
    return {
      title: '',
      model: {
        name: null,
        style: null
      },
      rules: {
        name: 'required',
        style: 'required'
      },
      messages: {
        name: {
          required: '标签名称必填.'
        },
        style: {
          required: '样式必填.'
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
    };
  },
  created() {
    this.pagingData(this.pageNumber, this.pageSize);
  },
  methods: {
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize);
    },
    async pagingData(pageNumber, pageSize) {
      this.loading = true;
      let result = await apiLabel.getList({ page: pageNumber, pageSize: pageSize });
      // console.log(result.data);
      this.total = result.data.totalCount;
      this.pageNumber = result.data.page;
      this.tableList = result.data.list;
      this.loading = false;
    },
    createRow() {
      this.model = {
        name: null,
        style: null
      };
      this.editingModel = null;
      this.dialogType = 'add';
      this.dialogVisible = true
    },
    updateRow(row) {
      this.editingModel = row;
      this.model = Object.assign({}, row);
      this.dialogType = 'edit';
      this.dialogVisible = true
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
        });
      })
    },
    async saveData(data) {
      if (this.editingModel) {
        await apiLabel.update(data)
        this.editingModel = null
        this.pagingData(this.pageNumber, this.pageSize)
      } else {
        await apiLabel.add(data)
        this.pagingData(1, this.pageSize)
      }
      this.dialogVisible = false
    },
    async deleteData(data) {
      await apiLabel.del(data);
    }
  }
};

</script>
