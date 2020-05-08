<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParam">
      <el-form-item label="订单号">
        <el-input v-model="queryParam.id" placeholder="订单号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">
          <i class="el-icon-search" />查找
        </el-button>
        <el-button type="primary" @click="download=download ? false : true">
          <i class="el-icon-download" />{{download ? "取消导出" : "导出"}}
        </el-button>
      </el-form-item>
    </el-form>
    <div v-if="!download">
      <router-link :to="{ path: 'edit'}">
        <el-button type="primary"><i class="el-icon-plus" />{{ $t('common.add') }}</el-button>
      </router-link>
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
            <GridColumn field="id" title="订单号" align="center" width="150" />
            <GridColumn field="order_amount" title="订单总价" align="center" width="150" />
            <GridColumn field="pay_amount" title="实售总额" align="center" width="150" />
            <GridColumn field="payed" title="已收款" align="center" width="150" />

            <GridColumn field="ship_status" title="发货状态" align="center" width="150">
              <template slot="body" slot-scope="scope">
                {{ getStatus(scope.row.ship_status, ship_status) }}
              </template>
            </GridColumn>
            <GridColumn field="pay_status" title="支付状态" align="center" width="150">
              <template slot="body" slot-scope="scope">
                {{ getStatus(scope.row.pay_status, ship_status) }}
              </template>
            </GridColumn>
            <GridColumn field="order_status" title="订单状态" align="center" width="150">
              <template slot="body" slot-scope="scope">
                {{ getStatus(scope.row.order_status, ship_status) }}
              </template>
            </GridColumn>
            <GridColumn field="created_at" title="下单时间" align="center" width="150">
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
        <GridColumnGroup :frozen="true" align="right" width="200">
          <GridHeaderRow>
            <GridColumn field="act" title="操作" align="center">
              <template slot="body" slot-scope="scope">
                <ButtonGroup style="height:24px">
                  <LinkButton>
                    <router-link :to="{ path: 'view', query: { id: scope.row.id }}"><i class="el-icon-edit-outline" /></router-link>
                  </LinkButton>
                  <LinkButton @click="payRow(scope.row)">支付</LinkButton>
                  <LinkButton @click="cancelRow(scope.row)">取消</LinkButton>
                  <LinkButton @click="deleteRow(scope.row)"><i class="el-icon-delete" /></LinkButton>
                </ButtonGroup>
              </template>
            </GridColumn>
          </GridHeaderRow>
        </GridColumnGroup>
      </DataGrid>
    </div>

    <div>
      <ExportExcel v-if="download" :sourceModel="sourceModel" :queryParam="queryParam" />
    </div>
  </div>
</template>
<script>
import * as apiOrder from '@/api/shop/order'
import ExportExcel from '@/components/Excel/ExportExcel'

export default {
  components: { ExportExcel },
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
      allChecked: false,
      rowClicked: false,
      order_status: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '完成'
        },
        {
          value: 3,
          label: '取消'
        }
      ],
      pay_status: [
        {
          value: 1,
          label: '未付款'
        },
        {
          value: 2,
          label: '已付款'
        },
        {
          value: 3,
          label: '部分付款'
        },
        {
          value: 4,
          label: '部分退款'
        },
        {
          value: 5,
          label: '已退款'
        }
      ],
      ship_status: [
        {
          value: 1,
          label: '未发货'
        },
        {
          value: 2,
          label: '已发货'
        },
        {
          value: 3,
          label: '部分发货'
        },
        {
          value: 4,
          label: '部分退货'
        },
        {
          value: 5,
          label: '已退货'
        }
      ],
      type: [
        {
          value: 1,
          label: '普通订单'
        },
        {
          value: 2,
          label: '长期订单'
        }
      ],
      download: false,
      sourceModel: "order.order"
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
    batchDelete() {
      let ids = this.checkedRows.map((item) => {
        return item.id
      })
      this.$confirm(this.$t('common.deleteTitle'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ id: ids });
      })
    },
    getStatus($status, $data) {
      let text = "";
      $data.forEach((item) => {
        if (item.value == $status) {
          text = item.label
        }
      })
      return text
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
      let res = await apiOrder.getList(param)
      this.total = res.data.totalCount
      this.tableList = res.data.list
      this.loading = false
    },
    async saveData(data, type = 1) {
      if (type == 1) {
        await apiOrder.update(data)
      } else {
        await apiOrder.add(data)
      }
    },
    async deleteData(data) {
      await apiOrder.del(data)
      this.pagingData(this.pageNumber, this.pageSize)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    }
  }
}

</script>
