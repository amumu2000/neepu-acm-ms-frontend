<script setup>
import {onMounted, ref} from 'vue'
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import Status from "@/components/Status.vue";
import Copyright from "@/components/Copyright.vue";
import {useUserStore} from "@/stores/User.js";
import {storeToRefs} from "pinia";
import axios from "axios";

const dialogVisible = ref(false)
const dialogStatisticVisible = ref(false)
const form = ref({
  p_url: '',
  c_url: '',
  cf_d: '',
})
const statistic = ref([])
const currentPage = ref(1)
const tableData = ref([])
const pageSize = ref(10)
const total = ref(100)
const isLoading = ref(false)
const options = Array.from({length: (3500 - 800) / 100 + 1}, (_, i) => {
  const value = 800 + i * 100;
  return {label: value, value: value};
});

const getList = () => {
  isLoading.value = true
  axios.post("http://localhost:5000/report/list", {
    pageSize: pageSize.value,
    currentPage: currentPage.value
  }).then((res) => {
    if (res.data) {
      total.value = res.data.data.total;
      tableData.value = res.data.data.list;
    }
    isLoading.value = false
  })
}

const submit = () => {
  axios.post("http://localhost:5000/report/add", {
    form: form.value
  }).then((res) => {
    if (res.data.code === 200) {
      dialogVisible.value = false
      getList()
    }
  })
}
const {isLogin, detail} = storeToRefs(useUserStore())
const handleSizeChange = () => {
  getList()
}

const handleCurrentChange = () => {
  getList()
}

const handleEdit = (row) => {
  form.value = {...row}
  dialogVisible.value = true
}

const handleReport = () => {
  form.value = {
    p_url: '',
    c_url: '',
    cf_d: '',
  }
  dialogVisible.value = true
}
const handleStatistic = () => {
  dialogStatisticVisible.value = true
  axios.post("http://localhost:5000/report/statistic").then((res) => {
    statistic.value = res.data.data.list
  })
}
onMounted(() => {
  getList()
})

</script>

<template>
  <div class="home-wrap" v-if="isLogin">
    <div class="home-btn-box">
      <el-button round @click="handleReport" type="danger">刷题上报</el-button>
      <el-button round @click="handleStatistic" type="primary">刷题数据</el-button>
      <div style="flex-grow: 1"></div>
      <div>{{ detail.info }}</div>
    </div>
    <div class="home-table-box">
      <el-table :data="tableData" style="width: 100%" height="500" v-loading="isLoading">
        <el-table-column prop="p_id" label="ID" :show-overflow-tooltip="true" width="100"/>
        <el-table-column prop="p_url" label="题目链接" :show-overflow-tooltip="true" width="280"/>
        <el-table-column prop="c_url" label="代码链接" :show-overflow-tooltip="true" width="280"/>
        <el-table-column prop="cf_d" label="CF难度" :show-overflow-tooltip="true" width="280"/>
        <el-table-column label="状态">
          <template #default="scope">
            <Status :status_code="scope.row.status_code" :status_text="scope.row.status_text"></Status>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :page-sizes="[5,10, 20,50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>


    <el-dialog
        class="home-dialog"
        width="1200px"
        v-model="dialogVisible"
        title="刷题上报"
        :close-on-click-modal="false"
    >
      <el-form :model="form" class="home-from">
        <div style="display: flex;">
          <el-form-item label="题目链接" class="from-item-inline inline-100">
            <el-input v-model="form.p_url"/>
          </el-form-item>
          <el-form-item label="CF难度" class="from-item-inline">
            <el-select
                v-model="form.cf_d"
                placeholder="Select"
                style="width: 240px"
            >
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="代码链接">
          <el-input v-model="form.c_url"/>
        </el-form-item>
        <h3 class="from-sub-title">解题思路</h3>
        <MdEditor v-model="form.md" class="editor"/>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        class="home-dialog-s"
        width="800px"
        v-model="dialogStatisticVisible"
        title="刷题数据"
        :close-on-click-modal="false">
      <el-table :data="statistic" height="500">
        <el-table-column prop="cf_d" label="CF难度" :show-overflow-tooltip="true" width="280"/>
        <el-table-column prop="count" label="数量" :show-overflow-tooltip="true" width="280"/>
      </el-table>
    </el-dialog>
  </div>
  <Copyright></Copyright>
</template>

<style lang="less" scoped>
.home-wrap {
  padding: 10px;
  min-height: calc(100vh - 160px);

  .home-btn-box {
    margin-bottom: 20px;
    display: flex;
  }

  .home-table-box {
    padding: 3px;
  }

  .home-dialog {
    .home-from {
      .from-sub-title {
        margin-bottom: 3px;
      }

      .inline-100 {
        width: 100%;
      }

      .from-item-inline + .from-item-inline {
        margin-left: 15px;
      }

      .editor {
        height: 45vh;
      }
    }
  }
}
</style>
