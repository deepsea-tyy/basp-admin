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
          <el-button type="danger" size="small" @click="revoke()">
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
import { view,assign,revoke } from '@/api/rbac/assignment'
import $ from 'jquery'

export default {
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
    this.getView()
  },
  methods: {
    async getView() {
      const res = await view(this.$route.query.id)
      this._opts = res.data
      this.initSelect()
    },
    async assign(){
      const res = await assign(this.$route.query.id,{items:this.savailable});
      this._opts = res.data
      this.initSelect()
    },
    async revoke(){
      const res = await revoke(this.$route.query.id,{items:this.sassign});
      this._opts = res.data
      this.initSelect()
    },
    searched(target) {
      search(target,this._opts);
    },
    initSelect(){
      search("available",this._opts)
      search("assigned",this._opts)
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
    };
    $.each($_opts[target], function (name, group) {
        if (name.indexOf(q) >= 0) {
            $('<option>').text(name).val(name).appendTo(groups[group][0]);
            groups[group][1] = true;
        }
    });
    $.each(groups, function () {
        if (this[1]) {
            $list.append(this[0]);
        }
    });
}
</script>
