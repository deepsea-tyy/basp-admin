<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <input class="search el-input__inner" @change="searched('available')" data-target="available" placeholder="Search for available">
        <select class="list" style="width: 100%;border: 1px solid #DCDFE6;" v-model="savailable" multiple size="20" data-target="available">
          <optgroup v-for="(item,index) in available" :label="index">
            <option v-for="val in item" :value="val">{{val}}</option>
          </optgroup>
        </select>
      </el-col>
      <el-col :span="4">
          <br>
          <br>
          <br>
          <el-button type="success" size="small" @click="assign()">
            <a :title="$t('common.view')">
              <i class="el-icon-d-arrow-right" />
            </a>
          </el-button>
          <br>
          <br>
          <br>
          <el-button type="danger" size="small" @click="remove()">
            <a :title="$t('common.view')">
              <i class="el-icon-d-arrow-left" />
            </a>
          </el-button>
      </el-col>
      <el-col :span="8">
        <input class="search el-input__inner" @change="searched('assigned')" data-target="assigned" placeholder="Search for assigned">
        <select class="list" style="width: 100%;border: 1px solid #DCDFE6;" v-model="sassign" multiple size="20" data-target="assigned">
          <optgroup v-for="(item,index) in assigned" :label="index">
            <option v-for="val in item" :value="val">{{val}}</option>
          </optgroup>
        </select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { viewRole,assign,remove } from '@/api/rbac/role'
import $ from 'jquery'

export default {
  name: 'RoleView',
  data(){
    return {
      available:[],
      assigned:[],
      savailable:[],
      sassign:[],
      _opts:[],
    }
  },
  created() {
    this.viewRole()
  },
  methods: {
    async viewRole() {
      const res = await viewRole(this.$route.query.id)
      this.available = res.data.available
      this.assigned = res.data.assigned
      this._opts = res.data
    },
    async assign(){
      const res = await assign(this.$route.query.id,{items:this.savailable});
      this.available = res.data.available
      this.assigned = res.data.assigned
    },
    async remove(){
      const res = await remove(this.$route.query.id,{items:this.sassign});
      this.available = res.data.available
      this.assigned = res.data.assigned
    },
    searched(target) {
      search(target,this._opts);
    }
  }
}

function search(target,$_opts) {
    var $list = $('select.list[data-target="' + target + '"]');
    $list.html('');
    var q = $('.search[data-target="' + target + '"]').val();

    var groups = {
        role: [$('<optgroup label="Roles">'), false],
        permission: [$('<optgroup label="Permission">'), false],
        route: [$('<optgroup label="Routes">'), false],
    };
    $.each($_opts[target], function (name, group) {
      $(group).each(function (i,v) {
        if (v.indexOf(q) >= 0) {
            $('<option>').text(v).val(v).appendTo(groups[name][0]);
            groups[name][1] = true;
        }
        
      })
    });
    $.each(groups, function () {
        if (this[1]) {
            $list.append(this[0]);
        }
    });
}
</script>
