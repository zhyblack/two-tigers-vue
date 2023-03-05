<script setup>
import {onMounted, reactive, ref, shallowRef} from 'vue'
import {
  Search, RefreshRight, Plus, Check, Close, Setting, Edit, Delete, User, House, List, Avatar, Operation, Tickets
} from '@element-plus/icons-vue'
import {table, save, update, remove} from '@/api/auth'
import {listTypes} from '@/api/dict'
import {ElMessage} from 'element-plus'
import store from "@/store";

const data = reactive({
  loading: false,
  query: {
    name: '',
    page: 1,
    limit: 20,
    authType: '',
  },
  addPermission: store.getters.permissionVerification('system:auth:add'),
  editPermission: store.getters.permissionVerification('system:auth:edit'),
  delPermission: store.getters.permissionVerification('system:auth:remove'),
  total: 0,
  list: [],
  authTypes: [],
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
      component: '',
      authType: 0,
      code: '',
      icon: '',
    }
  }
})

const rules = reactive({
  name: [
    {required: true, message: 'Please input name name', trigger: 'blur'},
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
  data.tab = false
  data.loading = true
  table(data.query)
      .then(response => {
        data.total = response.data.total
        data.list = response.data.items
        ElMessage({type: 'success', message: `数据载入成功。一共${data.total}条数据。`,})
      })
      .finally(() => {
        data.loading = false
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

      save(data.dialog.form)
          .then((response) => {
            const saveData = {...data.dialog.form, id: response.data.id}
            data.list.push(saveData)
            data.total += 1

            data.dialog.visible = false

            resetForm()
            ElMessage({message: response.msg, type: 'success',})
          })
          .finally(() => {
            data.dialog.formLoading = false
          })
    }
  })
}

const resetForm = () => {
  data.dialog.form = {id: 0, pid: 0, name: '', path: '', redirect: '', component: '', authType: 0, code: '', icon: '',}
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
            // data.list[data.dialog.editIndex] = data.dialog.form

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

const createChild = (index, row) => {
  data.dialog.form.pid = row.id
  data.dialog.form.code = row.code + ':'
  data.dialog.form.name = row.name
  if (row.authType !== 2) {
    data.dialog.form.authType = row.authType + 1
  }
  create()
}

const tableRowClassName = ({row}) => {
  if (row.authType === 0) {
    return ''
  } else if (row.authType === 1) {
    return 'success-row'
  } else if (row.authType === 2) {
    return 'warning-row'
  }
}

const icons = reactive({
  'User': shallowRef(User),
  'House': shallowRef(House),
  'Setting': shallowRef(Setting),
  'List': shallowRef(List),
  'Avatar': shallowRef(Avatar),
  'Operation': shallowRef(Operation),
  'Tickets': shallowRef(Tickets),
})

const loadDictList = () => {
  listTypes({code: 'auth_type'})
      .then(res => {
        data.authTypes = res.data
      })
}

const dictListType = (types, value) => {
  let label = ''
  types.forEach((e, i) => {
    if (e.value === value + '') {
      label = e.name
      return false
    }
  })
  return label
}

onMounted(() => {
  loadData()
  loadDictList()
})

</script>

<template>
  <el-card>
    <template #header>
      <el-form ref="form" :inline="true" :model="data.query" style="transform: 10%">
        <el-form-item class="form-item-auth" prop="name">
          <el-input v-model="data.query.name" placeholder="name"/>
        </el-form-item>
        <el-form-item class="form-item-auth" prop="authType">
          <el-select v-model="data.query.authType" placeholder="authType">
            <el-option label="authType" value=""/>
            <el-option v-for="type in data.authTypes" :label="type.name" :value="type.value"/>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-auth">
          <el-button-group>
            <el-button :loading="data.loading" @click="searchData" :icon="Search"/>
            <el-button @click="reset(form)" :icon="RefreshRight"/>
          </el-button-group>
        </el-form-item>
        <el-form-item class="form-item-auth">
          <el-button-group>
            <el-button v-if="data.addPermission" :icon="Plus" @click="create"/>
            <el-button :icon="RefreshRight" @click="reloadTable"/>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>


    <el-table
        :row-class-name="tableRowClassName"
        :data="data.list" style="width: 100%" v-loading="data.loading">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="pid" label="pid"/>
      <el-table-column prop="name" label="name"/>
      <el-table-column prop="path" label="path"/>
      <el-table-column prop="redirect" label="redirect"/>
      <el-table-column prop="component" label="component"/>
      <el-table-column prop="code" label="code"/>
      <el-table-column prop="icon" label="icon">
        <template #default="scope">
          <el-icon>
            <component :is="icons[scope.row.icon]"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="authType" label="authType">
        <template #default="scope">
          {{ dictListType(data.authTypes, scope.row.authType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="data.addPermission || data.editPermission || data.delPermission" align="center">
        <template #header>
          <el-icon>
            <Setting/>
          </el-icon>
        </template>
        <template #default="scope">
          <el-button-group>
            <el-button
                v-if="data.addPermission" size="small" :icon="Plus"
                @click="createChild(scope.$index, scope.row)"/>
            <el-button
                v-if="data.editPermission"
                size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"/>
            <el-popconfirm
                v-if="data.delPermission"
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
        :page-sizes="[ 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="sizeChange" @current-change="currentChange"
    />

  </el-card>
  <el-dialog
      v-model="data.dialog.visible"
      :title="data.dialog.title"
      width="40%"
      :before-close="handleClose" draggable
  >
    <el-form
        :model="data.dialog.form" ref="dialogForm" :rules="rules" :inline="true" label-width="120px"
        label-position="right">
      <el-form-item v-if="data.dialog.type === 2" label="id" prop="id">
        <el-input v-model="data.dialog.form.id" disabled placeholder="id"/>
      </el-form-item>
      <el-form-item label="pid" prop="pid">
        <el-input disabled v-model="data.dialog.form.pid" :disabled="data.dialog.type === 2" placeholder="pid"/>
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
      <el-form-item label="component" prop="component">
        <el-input v-model="data.dialog.form.component" placeholder="@/xxx/xxx/xxx.vue"/>
      </el-form-item>
      <el-form-item label="code" prop="code">
        <el-input v-model="data.dialog.form.code" placeholder="xxx:xxx:xx"/>
      </el-form-item>
      <el-form-item label="icon" prop="icon">
        <el-input v-model="data.dialog.form.icon" placeholder=""/>
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
            @click="data.dialog.type === 1 ? submit(dialogForm) : upload(dialogForm)"
            :icon="Check"/>
        <el-button @click="cancel" :icon="Close"/>
      </span>
    </template>
  </el-dialog>
</template>

<style>

.form-item-auth {
  margin-bottom: 0;
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

</style>
