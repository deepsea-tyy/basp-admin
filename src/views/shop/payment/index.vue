<template>
  <div class="app-container">
    <DataGrid :lazy="true" :data="tableList" :loading="loading" style="margin-top: 10px;">
      <GridColumnGroup>
        <GridHeaderRow>
          <GridColumn field="name" title="名称" align="center"/>
          <GridColumn field="code" title="编码" align="center"/>

          <GridColumn field="status" title="状态" align="center">
            <template slot="body" slot-scope="scope">
              <!-- <ComboBox v-model="scope.row.status" :data="[{text:'启用',value:1},{text:'禁用',value:2}]" @selectionChange="onStatusChange($event,scope.row)"></ComboBox> -->
              {{scope.row.status == 1 ? '启用':(scope.row.status == 2 ? '禁用' : '未设置')}}
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
                  <router-link :to="{ path: 'edit', query: { code: scope.row.code }}"><i class="el-icon-edit-outline" /></router-link>
                </LinkButton>
              </ButtonGroup>
            </template>
          </GridColumn>
        </GridHeaderRow>
      </GridColumnGroup>
    </DataGrid>
  </div>
</template>
<script>
import * as apiPayment from '@/api/shop/payment'

export default {
  data() {
    return {
      tableList: [],
      loading: false,
      queryParam: {
        page: 1,
        pageSize: 20
      }
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
    onStatusChange(event, row){
      console.log(row)
      apiPayment.updateConfig(row)
    },
    async pagingData(param) {
      this.loading = true
      let res = await apiPayment.getList(param)
      this.total = res.data.totalCount
      this.tableList = res.data.list
      this.loading = false
    }

  }
}

</script>