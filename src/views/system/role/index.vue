<script setup>
import {reactive, onMounted, ref} from 'vue'
import {Search, Plus, Refresh, Setting, Edit, Delete} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {table, create, update, remove} from '@/api/role'

const data = reactive({
  table: {
    list: [],
    limits: [10, 20, 50, 100],
    total: 0,
    loading: true,
  },
  query: {
    page: 1,
    limit: 10,
    name: '',
  },
  form: {
    name: '',
  },
  dialog: {
    index: 0,
    show: false,
    title: '',
    type: 0,
    form: {
      id: 0,
      name: '',
    },
    rules: {
      name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
    },
    fullscreen: false,
  },
})

const queryForm = ref()
const dialogForm = ref()

const search = () => {
  ElMessage('search')
  loadTableData()
}

const sizeChange = (limit) => {
  ElMessage('sizeChange')
  data.query.limit = limit
  const maxPage = Math.ceil(data.table.total / limit);
  if (maxPage < data.query.page) {
    data.query.page = maxPage
  }
  loadTableData()
}

const currentChange = (page) => {
  ElMessage('currentChange')
  data.query.page = page
  loadTableData()
}

const loadTableData = () => {
  ElMessage('loadTableData')
  data.table.loading = true
  table(data.query)
      .then(res => {
        data.table.list = res.data.items
        data.table.total = res.data.total
        ElMessage({message: `数据加载成功。一共 ${res.data.total} 条。`, type: 'success',})
      })
      .finally(() => {
        data.table.loading = false
      })
}

const toAdd = () => {
  ElMessage('toAdd')
  data.dialog.show = true
  data.dialog.type = 1
  data.dialog.title = '添加配置'
}

const refresh = () => {
  ElMessage('refresh')
  loadTableData()
}

const handleEdit = (index, row) => {
  ElMessage('handleEdit')
  data.dialog.show = true
  data.dialog.type = 2
  data.dialog.index = index
  data.dialog.title = '修改配置'
  data.dialog.form = {...row}
}

const handleDelete = (index, row, flag) => {
  ElMessage('handleDelete')
  if (flag) {
    data.table.loading = true
    remove({id: row.id})
        .then(() => {
          data.table.list.splice(index, 1)
          data.table.total -= 1
        })
        .finally(() => {
          data.table.loading = false
        })
  }
}

const closeDialog = () => {
  ElMessage('closeDialog')
  data.dialog.show = false
  data.dialog.form = {
    id: 0,
    name: '',
  }
}

const submit = (dialogForm) => {
  ElMessage('submit')
  dialogForm.validate((valid) => {
    if (valid) {
      data.dialog.fullscreen = true
      create(data.dialog.form)
          .then((res) => {
            data.table.list.push({...data.dialog.form, id: res.data.id})
            data.table.total += 1
            data.dialog.show = false
            ElMessage({message: res.msg, type: 'success',})
            dialogForm.resetFields()
          })
          .finally(() => {
            data.dialog.fullscreen = false
          })
    }
  })
}

const updateData = (dialogForm) => {
  ElMessage('updateData')
  dialogForm.validate((valid) => {
    if (valid) {
      data.dialog.fullscreen = true
      update(data.dialog.form)
          .then(() => {
            data.dialog.show = false
            data.table.list[data.dialog.index] = {...data.dialog.form}
            data.dialog.form = {
              id: 0,
              name: '',
              value: '',
            }
          })
          .finally(() => {
            data.dialog.fullscreen = false
          })
    }
  })
}

onMounted(() => {
  loadTableData()
})

</script>

<template>
  <el-card>
    <template #header>
      <el-form :inline="true" :model="data.query" ref="queryForm">
        <el-form-item class="form-item">
          <el-input v-model="data.query.name" placeholder="name"/>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button @click="search" :icon="Search" :loading="data.table.loading"></el-button>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button-group>
            <el-button @click="toAdd" :icon="Plus"></el-button>
            <el-button @click="refresh" :icon="Refresh" :loading="data.table.loading"></el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>

    <el-table :data="data.table.list" style="width: 100%" v-loading="data.table.loading">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="name"/>
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
        style="margin-top: 15px"
        v-model:current-page="data.query.page"
        v-model:page-size="data.query.limit"
        :page-sizes="data.table.limits"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.table.total"
        @size-change="sizeChange"
        @current-change="currentChange"
    />
  </el-card>

  <el-dialog
      v-model="data.dialog.show"
      :title="data.dialog.title"
      width="30%"
      :before-close="closeDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="dialogForm"
          :model="data.dialog.form" :rules="data.dialog.rules">
        <el-form-item v-if="data.dialog.type === 2" label="id" prop="id">
          <el-input v-model="data.dialog.form.id" disabled/>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="data.dialog.form.name" placeholder="name"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="data.dialog.fullscreen" type="primary"
            @click="data.dialog.type === 1 ? submit(dialogForm) : updateData(dialogForm)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-item {
  margin-bottom: 0;
}
</style>
