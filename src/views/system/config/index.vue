<script setup>
import {reactive, onMounted, ref} from 'vue'
import {Search, Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {dictTable, create} from '@/api/dict'

const pageData = reactive({
  table: {
    query: {
      name: '',
      page: 1,
      limit: 10,
    },
    list: [],
    total: 0,
    loading: true,
    dialog: false,
    title: '',
    type: 0,
    form: {
      name: '',
      code: '',
    },
    fullscreen: false,
  }
})

const form = ref()

const dictRules = {
  name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
  code: [{required: true, message: 'Please input code ', trigger: 'blur'},]
}

const loadTableData = () => {
  pageData.table.loading = true
  dictTable(pageData.table.query)
      .then((res) => {
        pageData.table.list = res.data.items
        pageData.table.total = res.data.total
        console.log('res.data.items = ', res.data.items)
        ElMessage({message: `数据加载成功。一共 ${res.data.total} 条。`, type: 'success',})
      })
      .finally(() => {
        pageData.table.loading = false
      })
}

const searchTable = () => {
  loadTableData()
}

const tableSizeChange = () => {

}

const tableCurrentChange = () => {

}

const closeDictDialog = () => {
  form.value.resetFields()
  pageData.table.dialog = false
  ElMessage('取消了操作。')
}

const submitAddDict = (form) => {
  pageData.table.fullscreen = true
  create(pageData.table.form)
      .then((res) => {
        console.log('{...pageData.table.form, id: res.data.id} = ', {...pageData.table.form, id: res.data.id})
        pageData.table.list.push({...pageData.table.form, id: res.data.id})
        pageData.table.total += 1
        pageData.table.dialog = false
        ElMessage({message: res.msg, type: 'success',})
        form.resetFields()
      })
      .finally(() => {
        pageData.table.fullscreen = false
      })
  // dictForm.resetFields()
}

const addDict = () => {
  pageData.table.dialog = true
  pageData.table.title = '添加字典'
  pageData.table.type = 1
}

onMounted(() => {
  loadTableData()
})

</script>

<template>
  <el-card>
    <template #header>
      <el-form :inline="true" :model="pageData.table.query" class="demo-form-inline">
        <el-form-item class="form-item">
          <el-input v-model="pageData.table.query.name" placeholder="name"/>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button :loading="pageData.table.loading" @click="searchTable" :icon="Search"></el-button>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button @click="addDict" :icon="Plus"></el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="pageData.table.list" v-loading="pageData.table.loading">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="name"/>
      <el-table-column prop="code" label="code"/>
    </el-table>
    <el-pagination
        v-model:current-page="pageData.table.query.page"
        v-model:page-size="pageData.table.query.limit"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.table.total"
        @size-change="tableSizeChange"
        @current-change="tableCurrentChange"
        style="margin-top: 15px"
    />
  </el-card>

  <el-dialog
      v-model="pageData.table.dialog"
      :title="pageData.table.title"
      width="30%"
      :before-close="closeDictDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="form"
          :model="pageData.table.form" :rules="dictRules">
        <el-form-item label="name" prop="name">
          <el-input v-model="pageData.table.form.name" placeholder="name"/>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="pageData.table.form.code" placeholder="code"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDictDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="pageData.table.fullscreen" type="primary"
            @click="submitAddDict(form)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

.form-item {
  margin-bottom: 0;
}

</style>
