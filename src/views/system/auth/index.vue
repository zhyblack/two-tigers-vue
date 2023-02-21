<script setup>
import {onMounted, reactive, ref} from 'vue'
import {Search, RefreshRight, Plus, Check, Close, Setting, Edit, Delete} from '@element-plus/icons-vue'
import {table, save, update, remove} from '@/api/auth'
import {ElMessage} from 'element-plus'

const data = reactive({
  loading: false,
  query: {
    name: '',
    page: 1,
    limit: 10,
  },
  total: 0,
  list: [],
  dialog: {
    formLoading: false,
    visible: false,
    title: '',
    type: 0,
    editIndex: 0,
    form: {
      id: 0,
      pid: 0,
      name: '',
      path: '',
      redirect: '',
      componet: '',
      authType: 0,
      code: '',
    }
  }
})

const rules = reactive({
  pid: [
    {required: true, message: 'Please input pid name', trigger: 'blur'},
  ],
  name: [
    {required: true, message: 'Please input name name', trigger: 'blur'},
  ],
  path: [
    {required: true, message: 'Please input path name', trigger: 'blur'},
  ],
  componet: [
    {required: true, message: 'Please input componet name', trigger: 'blur'},
  ],
  authType: [
    {required: true, message: 'Please input authType name', trigger: 'blur'},
  ],
  code: [
    {required: true, message: 'Please input code name', trigger: 'blur'},
  ],
})

const form = ref()
const dialogForm = ref()

const reset = (form) => {
  form.resetFields()
  ElMessage({type: 'success', message: '重置成功。',})
}

const searchData = () => {
  data.query.page = 1
  loadData()
}

const loadData = () => {
  data.loading = true
  table(data.query)
      .then(response => {
        data.total = response.data.total
        data.list = response.data.items
        data.loading = false

        ElMessage({type: 'success', message: `数据载入成功。一共${data.total}条数据。`,})
      })
}

const create = () => {
  data.dialog.visible = true
  data.dialog.title = '添加权限'
  data.dialog.type = 1
}

const submit = (dialogForm) => {
  dialogForm.validate((valid) => {
    if (valid) {
      data.dialog.formLoading = true
      console.log(data.dialog.form)

      save(data.dialog.form)
          .then((response) => {
            const saveData = {...data.dialog.form, id: response.data.id}
            data.list.push(saveData)
            data.total += 1

            data.dialog.formLoading = false
            data.dialog.visible = false

            resetForm()
            ElMessage({message: response.msg, type: 'success',})
          })
    }
  })
}

const resetForm = () => {
  data.dialog.form = {id: 0, pid: 0, name: '', path: '', redirect: '', componet: '', authType: 0, code: '',}
}

const sizeChange = (limit) => {
  data.query.limit = limit
  const maxPage = Math.ceil(data.total / limit);
  if (maxPage < data.query.page) {
    data.query.page = maxPage
  }
  loadData()
}

const currentChange = (page) => {
  data.query.page = page
  loadData()
}

const handleEdit = (index, row) => {
  // console.log(index, row)
  data.dialog.editIndex = index

  data.dialog.form = row

  data.dialog.visible = true
  data.dialog.title = '编辑权限'
  data.dialog.type = 2
}

const upload = (dialogForm) => {
  dialogForm.validate((valid) => {
    if (valid) {
      data.dialog.formLoading = true
      update(data.dialog.form)
          .then((response) => {
            data.list[data.dialog.editIndex] = data.dialog.form

            data.dialog.formLoading = false
            data.dialog.visible = false

            resetForm()
            ElMessage({message: response.msg, type: 'success',})
          })
    }
  })
}

const handleDelete = (index, row, confirm) => {
  if (confirm) {
    data.loading = true
    remove({id: row.id})
        .then((response) => {
          data.loading = false
          data.list.splice(index, 1)
          data.total -= 1
          ElMessage({message: response.msg, type: 'success',})
        })
  } else {
    ElMessage({type: 'info', message: '取消删除。',})
  }

}

const cancel = () => {
  data.dialog.visible = false
  resetForm()
  ElMessage('取消了操作。')
}

const handleClose = () => {
  cancel(dialogForm)
}

const reloadTable = () => {
  loadData()
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <el-form ref="form" :inline="true" :model="data.query">
    <el-form-item prop="name">
      <el-input v-model="data.query.name" placeholder="name"/>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button :loading="data.loading" @click="searchData" :icon="Search"/>
        <el-button @click="reset(form)" :icon="RefreshRight"/>
      </el-button-group>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button :icon="Plus" @click="create"/>
        <el-button :icon="RefreshRight" @click="reloadTable"/>
      </el-button-group>
    </el-form-item>
  </el-form>

  <el-table :data="data.list" style="width: 100%" v-loading="data.loading">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="pid" label="pid"/>
    <el-table-column prop="name" label="name"/>
    <el-table-column prop="path" label="path"/>
    <el-table-column prop="redirect" label="redirect"/>
    <el-table-column prop="componet" label="componet"/>
    <el-table-column prop="code" label="code"/>
    <el-table-column prop="authType" label="authType"/>
    <el-table-column align="center">
      <template #header>
        <el-icon>
          <Setting/>
        </el-icon>
      </template>
      <template #default="scope">
        <el-button-group>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
          <el-popconfirm
              title="确定要删除这条数据？此操作不可以逆。"
              confirm-button-type="danger"
              @confirm="handleDelete(scope.$index, scope.row, true)"
              @cancel="handleDelete(scope.$index, scope.row, false)">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      style="margin-top: 10px"
      v-model:current-page="data.query.page"
      v-model:page-size="data.query.limit"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
      @size-change="sizeChange" @current-change="currentChange"
  />

  <el-dialog
      v-model="data.dialog.visible"
      :title="data.dialog.title"
      width="40%"
      :before-close="handleClose"
  >
    <el-form
        :model="data.dialog.form" ref="dialogForm" :rules="rules" :inline="true" label-width="120px"
        label-position="right">
      <el-form-item v-if="data.dialog.type === 2" label="id" prop="id">
        <el-input v-model="data.dialog.form.id" disabled placeholder="id"/>
      </el-form-item>
      <el-form-item label="pid" prop="pid">
        <el-input v-model="data.dialog.form.pid" :disabled="data.dialog.type === 2" placeholder="pid"/>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="data.dialog.form.name" placeholder="name"/>
      </el-form-item>
      <el-form-item label="path" prop="path">
        <el-input v-model="data.dialog.form.path" placeholder="/"/>
      </el-form-item>
      <el-form-item label="redirect" prop="redirect">
        <el-input v-model="data.dialog.form.redirect" placeholder="/xxx"/>
      </el-form-item>
      <el-form-item label="componet" prop="componet">
        <el-input v-model="data.dialog.form.componet" placeholder="@/xxx/xxx/xxx.vue"/>
      </el-form-item>
      <el-form-item label="code" prop="code">
        <el-input v-model="data.dialog.form.code" placeholder="xxx:xxx:xx"/>
      </el-form-item>
      <el-form-item label="authType" prop="authType">
        <el-select v-model="data.dialog.form.authType" placeholder="please select your authType">
          <el-option label="目录" :value="0"/>
          <el-option label="菜单" :value="1"/>
          <el-option label="按钮" :value="2"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button
            type="primary" v-loading.fullscreen.lock="data.dialog.formLoading"
            @click="data.dialog.type === 1 ? submit(dialogForm) : upload(dialogForm)"><el-icon><Check/></el-icon></el-button>
        <el-button @click="cancel"><el-icon><Close/></el-icon></el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
