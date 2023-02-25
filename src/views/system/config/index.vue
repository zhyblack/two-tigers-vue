<script setup>
import {reactive, onMounted, ref} from 'vue'
import {Search, Plus, RefreshRight, Delete, Edit, Setting} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {table, create, update, remove} from '@/api/config'

const pageData = reactive({
  table: {
    query: {
      name: '',
      page: 1,
      limit: 10,
    },
    form: {
      id: 0,
      name: '',
      value: '',
    },
    loading: true,
    list: [],
    total: 0,
    dialog: false,
    title: '',
    index: 0,
    rules: {
      name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
      value: [{required: true, message: 'Please value code ', trigger: 'blur'},]
    },
    type: 0,
    fullscreen: false,
  }
})

const form = ref()

const loadData = () => {
  pageData.table.loading = true
  table(pageData.table.query)
      .then((res) => {
        pageData.table.list = res.data.items
        pageData.table.total = res.data.total
        ElMessage({message: `数据加载成功。一共 ${res.data.total} 条。`, type: 'success',})
      })
      .finally(() => {
        pageData.table.loading = false
      })
}

const search = () => {
  loadData()
}

const handleSizeChange = (limit) => {
  ElMessage('handleSizeChange')
  pageData.table.query.limit = limit
  const maxPage = Math.ceil(pageData.table.total / limit);
  if (maxPage < pageData.table.query.page) {
    pageData.table.query.page = maxPage
  }
  loadData()
}

const handleCurrentChange = (page) => {
  ElMessage('handleCurrentChange')
  pageData.table.query.page = page
  loadData()
}

const addConfig = () => {
  pageData.table.dialog = true
  pageData.table.type = 1
  pageData.table.title = '添加配置'
}

const reloadTable = () => {
  loadData()
}

const closeDialog = () => {
  pageData.table.dialog = false
  pageData.table.form = {
    id: 0,
    name: '',
    value: '',
  }
}

const submit = (form) => {
  form.validate((valid) => {
    if (valid) {
      pageData.table.fullscreen = true
      create(pageData.table.form)
          .then((res) => {
            pageData.table.list.push({...pageData.table.form, id: res.data.id})
            pageData.table.total += 1
            pageData.table.dialog = false
            ElMessage({message: res.msg, type: 'success',})
            form.resetFields()
          })
          .finally(() => {
            pageData.table.fullscreen = false
          })
    }
  })
}

const updateData = (form) => {
  form.validate((valid) => {
    if (valid) {
      pageData.table.fullscreen = true
      update(pageData.table.form)
          .then(() => {
            pageData.table.dialog = false
            pageData.table.list[pageData.table.index] = {...pageData.table.form}
            pageData.table.form = {
              id: 0,
              name: '',
              value: '',
            }
            // form.resetFields()
          })
          .finally(() => {
            pageData.table.fullscreen = false
          })
    }
  })
}

const handleEdit = (index, row) => {
  pageData.table.dialog = true
  pageData.table.type = 2
  pageData.table.index = index
  pageData.table.title = '修改配置'
  pageData.table.form = {...row}
}

const handleDelete = (index, row, flag) => {
  if (flag) {
    pageData.table.loading = true
    remove({id: row.id})
        .then(() => {
          pageData.table.list.splice(index, 1)
          pageData.table.total -= 1
          pageData.table.loading = false
        })
        .finally(() => {
          pageData.table.loading = false
        })
  }
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <el-card>
    <template #header>
      <div>
        <el-form :inline="true" :model="pageData.table.query">
          <el-form-item class="form-item">
            <el-input v-model="pageData.table.query.name" placeholder="name"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button :loading="pageData.table.loading" @click="search" :icon="Search"></el-button>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button-group>
              <el-button @click="addConfig" :icon="Plus"></el-button>
              <el-button :loading="pageData.table.loading" :icon="RefreshRight" @click="reloadTable"/>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-table v-loading="pageData.table.loading" :data="pageData.table.list" style="width: 100%">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="name"/>
      <el-table-column prop="value" label="value"/>
      <el-table-column align="center">
        <template #header>
          <el-icon>
            <Setting/>
          </el-icon>
        </template>
        <template #default="scope">
          <el-button-group>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"/>
            <el-popconfirm
                title="确定要删除这条数据？此操作不可以逆。"
                confirm-button-type="danger"
                @confirm="handleDelete(scope.$index, scope.row, true)"
                @cancel="handleDelete(scope.$index, scope.row, false)">
              <template #reference>
                <el-button size="small" type="danger" :icon="Delete"/>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageData.table.query.page"
        v-model:page-size="pageData.table.query.limit"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.table.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 15px"
    />
  </el-card>

  <el-dialog
      v-model="pageData.table.dialog"
      :title="pageData.table.title"
      width="30%"
      :before-close="closeDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="form"
          :model="pageData.table.form" :rules="pageData.table.rules">
        <el-form-item v-if="pageData.table.type === 2" label="id" prop="id">
          <el-input v-model="pageData.table.form.id" disabled/>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="pageData.table.form.name" placeholder="name"/>
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input v-model="pageData.table.form.value" placeholder="value"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="pageData.table.fullscreen" type="primary"
            @click="pageData.table.type === 1 ? submit(form) : updateData(form)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

.form-item {
  margin-bottom: 0;
}

</style>
