<template>
  <div class="app-container">
    <router-link :to="{ path: 'edit'}"><el-button type="primary"><i class="el-icon-plus" />{{ $t('common.add') }}</el-button></router-link>

    <DataGrid :pagination="true" :lazy="true" :data="tableList" :total="total" :loading="loading" :page-number="pageNumber" :page-size="pageSize" @pageChange="onPageChange($event)">
      <GridColumn align="center" cell-css="datagrid-td-rownumber" width="30">
        <template slot="body" slot-scope="scope">
          {{ scope.rowIndex + 1 }}
        </template>
      </GridColumn>
      <GridColumn field="name" title="名称" align="center" />
      <GridColumn field="image" title="图片" align="center">
        <template slot="body" slot-scope="scope">
          <img height="25px" :src="scope.row.image.file_url">
        </template>
      </GridColumn>
      <GridColumn field="status" title="状态" align="center">
        <template slot="body" slot-scope="scope">
          {{ scope.row.status ==1 ? '显示' : '隐藏' }}
        </template>
      </GridColumn>
      <GridColumn field="sort" title="排序" align="center" />
      <GridColumn field="act" title="操作" align="center" width="100">
        <template slot="body" slot-scope="scope">
          <ButtonGroup style="height:24px">
            <LinkButton><router-link :to="{ path: 'edit', query: { id: scope.row.id }}"><i class="el-icon-edit-outline" /></router-link></LinkButton>
            <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
          </ButtonGroup>
        </template>
      </GridColumn>
    </DataGrid>
  </div>
</template>
<script>
import * as apiCategory from '@/api/spu/category'

export default {
  data() {
    return {
      total: 0,
      pageNumber: 1,
      pageSize: 15,
      loading: false,
      tableList: [],
      status: [
        { value: '1', text: '显示' },
        { value: '2', text: '隐藏' }
      ],
    }
  },
  created() {
    this.pagingData(this.pageNumber, this.pageSize)
  },
  methods: {
    onPageChange(event) {
      this.pagingData(event.pageNumber, event.pageSize)
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
      const result = await apiCategory.getList({ page: pageNumber, pageSize: pageSize })
      this.total = result.data.totalCount
      this.pageNumber = result.data.page
      this.tableList = result.data.list
      this.loading = false
    },
    async deleteData(data) {
      await apiCategory.del(data)
    },
  }
}

</script>
