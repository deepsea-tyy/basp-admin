<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole"><i class="el-icon-plus" />{{$t('common.add')}}</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Rule Name">
        <template slot-scope="scope">
          {{ scope.row.ruleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Data">
        <template slot-scope="scope">
          {{ scope.row.data }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleView(scope)">
            <a :title="$t('common.view')">
              <i class="el-icon-view" />
            </a>
            
          </el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('common.editTitle'):$t('common.addTitle')">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        
        <el-form-item label="RuleName">
          <el-input v-model="role.rule_name" placeholder="规则名称" />
        </el-form-item>

        <el-form-item label="Data">
          <el-input v-model="role.data" placeholder="数据" />
        </el-form-item>

        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色说明"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/rbac/role'

const defaultRole = {
  name: '',
  description: '',
  rule_name: '',
  data: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)

      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.name)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateRole(this.role.name, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].name === this.role.name) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.rolesList.push(this.role)
      }

      const { description, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Nmae: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    handleView(scope){
      // console.log(scope)
      this.$router.push({path: '/rbac/role/view',query: {id: scope.row.name}})
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
}
</style>
