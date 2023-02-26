<script setup>
import {onMounted, reactive, ref} from 'vue'
import {Search, RefreshRight} from '@element-plus/icons-vue'
import {table} from '@/api/user'

const data = reactive({
  loading: false,
  query: {
    title: '',
    page: 1,
    limit: 20,
  },
  total: 0,
  list: []
})

const form = ref()

const reset = (form) => {
  form.resetFields()
}

const search = () => {
  loadData()
}

const loadData = () => {
  data.loading = true
  table(data.query)
      .then(response => {
        console.log(response)
        data.total = response.data.total
        data.list = response.data.items
      })
      .finally(() => {
        data.loading = false
      })
}

onMounted(loadData)

</script>

<template>

  <el-card>
    <template #header>
      <el-form ref="form" :inline="true" :model="data.query">
        <el-form-item prop="title" class="form-item">
          <el-input v-model="data.query.title" placeholder="title"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="data.loading" @click="search" :icon="Search"/>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button @click="reset(form)" :icon="RefreshRight"/>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="data.list" style="width: 100%">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="uuid" label="uuid"/>
      <el-table-column prop="username" label="username"/>
      <el-table-column prop="password" label="password"/>
      <el-table-column prop="nickname" label="nickname"/>
      <el-table-column prop="avatar" label="avatar"/>
      <el-table-column prop="introduction" label="introduction"/>
    </el-table>
    <el-pagination
        style="margin-top: 15px"
        v-model:current-page="data.query.page"
        v-model:page-size="data.query.limit"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
    />

  </el-card>
</template>

<style scoped>

.form-item {
  margin-bottom: 0;
}

</style>
