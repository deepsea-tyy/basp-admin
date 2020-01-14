<template>
  <div class="app-container">
    <el-table :data="tableList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="User Name">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Operations" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleView(scope)">
            <a :title="$t('common.view')">
              <i class="el-icon-view" />
            </a>
            
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import path from 'path'
import { getList } from '@/api/rbac/assignment'

export default {
  data() {
    return {
      row: {},
      tableList: []
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await getList()
      this.tableList = res.data
    },
    handleView(scope){
      // console.log(scope)
      this.$router.push({path: '/rbac/assignment/view',query: {id: scope.row.id}})
    }
  }
}
</script>