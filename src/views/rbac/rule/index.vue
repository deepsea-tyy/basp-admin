<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd"><i class="el-icon-plus" />{{$t('common.add')}}</el-button>

    <el-table :data="tableList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Rule Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Class Name">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Operations" >
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" @click="handleView(scope)">
            <a :title="$t('common.view')">
              <i class="el-icon-view" />
            </a>
            
          </el-button> -->
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Rule':'New Rule'">
      <el-form :model="row" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="row.name" placeholder="规则名称" />
        </el-form-item>
        
        <el-form-item label="RuleName">
          <el-input v-model="row.className" placeholder="类名" />
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
import { deepClone } from '@/utils'
import { getRules, addRule, deleteRule, updateRule } from '@/api/rbac/rule'

const defaultRow = {
  name: '',
  className: ''
}

export default {
  data() {
    return {
      row: Object.assign({}, defaultRow),
      tableList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getRules()
      this.tableList = res.data
    },
    handleAdd(){
      this.row = Object.assign({}, defaultRow)

      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.row = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the row?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRule(row.name)
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
        await updateRule(this.row.name, this.row)
        for (let index = 0; index < this.tableList.length; index++) {
          if (this.tableList[index].name === this.row.name) {
            this.tableList.splice(index, 1, Object.assign({}, this.row))
            break
          }
        }
      } else {
        const { data } = await addRule(this.row)
        this.tableList.push(this.row)
      }

      this.dialogVisible = false
      this.$notify({
        title: "操作成功",
        type: 'success'
      })
    }/*,
    handleView(scope){
      // console.log(scope)
      this.$router.push({path: '/rbac/row/view',query: {id: scope.row.name}})
    }*/
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .rows-table {
    margin-top: 30px;
  }
}
</style>
