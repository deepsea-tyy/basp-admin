<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd"><i class="el-icon-plus" />{{$t('common.add')}}</el-button>
    <el-table :data="tableList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="route">
        <template slot-scope="scope">
          {{ scope.row.route }}
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Operations" >
        <template slot-scope="scope">

          <el-button type="primary" size="small" @click="handleEdit(scope)">
            <a :title="$t('common.edit')">
              <i class="el-icon-edit-outline" />
            </a>
            
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            <a :title="$t('common.delete')">
              <i class="el-icon-delete" />
            </a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit ':'New '">
      <el-form :model="row" label-width="80px" label-position="left">
        <el-form-item label="菜单名称">
          <el-input v-model="row.name" />
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input v-model="row.order" />
        </el-form-item>

        <el-form-item label="父级名称">
          <el-input v-model="row.parent_name" />
        </el-form-item>

        <el-form-item label="路由">
          <el-input v-model="row.route"/>
        </el-form-item>

        <el-form-item label="数据">
          <el-input v-model="row.data" type="textarea" rows="4"/>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRow">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import path from 'path'
import { getList,del,add,update } from '@/api/rbac/menu'

export default {
  data() {
    return {
      row: {},
      dialogVisible: false,
      dialogType: 'new',
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
    handleAdd(){
      this.row = {}

      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.row = scope.row
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the menu?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await del(row.id)
          this.tableList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRow() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await update(this.row.id, this.row)
        for (let index = 0; index < this.tableList.length; index++) {
          if (this.tableList[index].id === this.row.id) {
            this.tableList.splice(index, 1, Object.assign({}, this.row))
            break
          }
        }
      } else {
        const { data } = await add(this.row)
        this.tableList.push(this.row)
      }

      this.dialogVisible = false
      this.$notify({
        title: "操作成功",
        type: 'success'
      })
    }
  }
}
</script>