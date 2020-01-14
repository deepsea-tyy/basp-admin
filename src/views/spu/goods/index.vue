<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParam">
      <el-form-item label="商品名称">
        <el-input v-model="queryParam.name" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="queryParam.status" placeholder="上架状态">
          <el-option v-for="item in options.is_on_shelves" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">
          <svg-icon icon-class="search" />查找</el-button>
      </el-form-item>
    </el-form>

    <router-link to="/spu/goods/create"><el-button type="primary"><i class="el-icon-plus" />{{ $t('common.add') }}</el-button></router-link>
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
          <GridColumn field="is_hot" title="热门" align="center">
            <template slot="body" slot-scope="scope">
              {{ scope.row.is_hot == 1 ? '是':'否' }}
            </template>
          </GridColumn>
          <GridColumn field="is_recommend" title="推荐" align="center">
            <template slot="body" slot-scope="scope">
              {{ scope.row.is_recommend == 1 ? '是':'否' }}
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
      <GridColumnGroup>
        <GridHeaderRow>
          <GridColumn field="name" title="名称" align="center"  width="150"/>
          <GridColumn field="labels" title="标签" align="center" width="150">
            <template slot="body" slot-scope="scope">
              <ComboBox
                style="width: 142px"
                @selectionChange="setLabel(scope.row.id,$event,scope.row.labels)"
                name="glabel"
                valueField="id"
                textField="name"
                v-model="scope.row.labels"
                :data="glabel" 
                :multiple="true"></ComboBox>
            </template>
          </GridColumn>
          <GridColumn field="gn" title="商品编码" align="center"  width="150"/>
          <GridColumn field="coverItem" title="商品封面图片" align="center" width="150">
            <template slot="body" slot-scope="scope">
              <img :src="scope.row.coverItem.file_url" height="25px">
            </template>
          </GridColumn>
          <GridColumn field="price" title="售价" align="center"  width="150"/>
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
                <LinkButton>
                  <router-link :to="{ path: 'update', query: { id: scope.row.id }}"><i class="el-icon-edit-outline" /></router-link>
                </LinkButton>
                <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
              </ButtonGroup>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
    </DataGrid>
  </div>
</template>
<script>
import * as apiGoods from '@/api/spu/goods'
import * as apiLabel from '@/api/base/lable'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      total: 0,
      tableList: [],
      loading: false,
      queryParam: {
        page: 1,
        pageSize: 20,
        name: null,
        status: null
      },
      options: {
        is_on_shelves: [
          {
            value: null,
            label: '请选择'
          },
          {
            value: 1,
            label: '上架'
          }, {
            value: 2,
            label: '下架'
          }
        ]
      },
      allChecked: false,
      rowClicked: false,
      glabel: []
    }
  },
  created() {
    this.pagingData(this.queryParam)
    this.labelData()
  },
  computed: {
    checkedRows() {
      return this.tableList.filter(row => row.selected);
    }
  },
  methods: {
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
    setLabel(id,event,labels){
      if (event.length != labels.length) {
        apiGoods.setLabel(id,event)
      }
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
      let res = await apiGoods.getList(param)
      res.data.list = res.data.list.map((item) => {
        item.labels = item.labels.map((label)=>{
          return label.lable_id
        })
        return item
      })
      this.total = res.data.totalCount
      this.tableList = res.data.list
      this.loading = false
    },
    async saveData(data, type = 1) {
      if (type == 1) {
        await apiGoods.update(data)
      } else {
        await apiGoods.add(data)
      }
    },
    async deleteData(data) {
      await apiGoods.del(data)
      this.pagingData(this.pageNumber, this.pageSize)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    async labelData(data) {
      let res = await apiLabel.getList({pageSize: 100})
      this.glabel = res.data.list
    }
  }
}

</script>
