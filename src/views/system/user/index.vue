<script setup>
import {onMounted, reactive, ref} from 'vue'
import {Search, RefreshRight, Plus, Edit, Delete, Connection, Setting} from '@element-plus/icons-vue'
import {table, create, update, remove, roles, userRoles} from '@/api/user'
import {ElMessage} from 'element-plus'

const data = reactive({
  loading: true,
  query: {
    title: '',
    page: 1,
    limit: 20,
  },
  total: 0,
  list: [],
  dialog: false,
  title: '',
  type: 0,
  form: {
    id: 0,
    username: '',
    password: '',
    nickname: '',
    avatar: '',
    introduction: '',
  },
  rules: {
    username: [{required: true, message: 'Please input username ', trigger: 'blur'},],
    password: [{required: true, message: 'Please value password ', trigger: 'blur'},]
  },
  fullscreen: false,
  index: 0,
  roleDialog: {
    roleLoading: false,
    show: false,
    roles: [],
    form: {
      userId: 0,
      roles: [],
    },
    rules: {
      roles: [
        {
          type: 'array',
          required: true,
          message: 'Please select at least one roles type',
          trigger: 'change',
        },
      ],
    },
  }
})

const form = ref()
const roleForm = ref()

const search = () => {
  loadData()
}

const loadData = () => {
  ElMessage('loadData')
  data.loading = true
  table(data.query)
      .then(response => {
        data.total = response.data.total
        data.list = response.data.items
        data.loading = false

        ElMessage({type: 'success', message: `数据载入成功。一共${data.total}条数据。`,})
      })
}

const reloadTable = () => {
  loadData()
}

const closeDialog = () => {
  ElMessage('closeDialog')
  data.dialog = false
  data.form = {
    id: 0,
    username: '',
    password: '',
    nickname: '',
    avatar: '',
    introduction: '',
  }
}

const submit = (form) => {
  ElMessage('submit')
  form.validate((valid) => {
    if (valid) {
      data.fullscreen = true
      create(data.form)
          .then((res) => {
            data.list.push({...data.form, id: res.data.id, uuid: res.data.uuid})
            data.total += 1
            data.dialog = false
            ElMessage({message: res.msg, type: 'success',})
            form.resetFields()
          })
          .finally(() => {
            data.fullscreen = false
          })
    }
  })
}

const updateData = (form) => {
  ElMessage('updateData')
  form.validate((valid) => {
    if (valid) {
      data.fullscreen = true
      update(data.form)
          .then(() => {
            data.dialog = false
            data.list[data.index] = {...data.form}
            data.form = {
              id: 0,
              username: '',
              password: '',
              nickname: '',
              avatar: '',
              introduction: '',
            }
            // form.resetFields()
          })
          .finally(() => {
            data.fullscreen = false
          })
    }
  })
}

const toAdd = () => {
  ElMessage('toAdd')
  data.dialog = true
  data.type = 1
  data.title = '添加用户'
}

const handleEdit = (index, row) => {
  ElMessage('handleEdit')
  data.dialog = true
  data.type = 2
  data.index = index
  data.title = '修改用户'
  data.form = {...row}
}

const handleDelete = (index, row, flag) => {
  ElMessage('handleDelete')
  if (flag) {
    data.loading = true
    remove({id: row.id})
        .then(() => {
          data.list.splice(index, 1)
          data.total -= 1
          data.loading = false
        })
        .finally(() => {
          data.loading = false
        })
  }
}

const toRoles = (row) => {
  ElMessage('toRoles')
  data.roleDialog.show = true
  data.roleDialog.form.userId = row.id
  data.roleDialog.roleLoading = true
  roles({userId: row.id})
      .then(res => {
        data.roleDialog.roles = res.data.roles
        data.roleDialog.form.roles = res.data.haves
      })
      .finally(() => {
        data.roleDialog.roleLoading = false
      })
}
const handleCloseRoleDialog = () => {
  ElMessage('handleCloseRoleDialog')
  data.roleDialog.show = false
}

const submitRole = (roleForm) => {
  ElMessage('submitRole')
  console.log(data.roleDialog.form)
  roleForm.validate((valid) => {
    if (valid) {
      data.fullscreen = true
      userRoles(data.roleDialog.form)
          .then(res => {
            data.roleDialog.show = false
            data.roleDialog.form.roles = []
            ElMessage({message: res.msg, type: 'success',})
          })
          .finally(() => {
            data.fullscreen = false
          })
    }
  })
}

onMounted(loadData)

</script>

<template>
  <el-card>
    <template #header>
      <el-form ref="form" :inline="true" :model="data.query" class="demo-form-inline">
        <el-form-item class="form-item" prop="title">
          <el-input v-model="data.query.title" placeholder="title"/>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button-group>
            <el-button :loading="data.loading" @click="search" :icon="Search"/>
          </el-button-group>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button-group>
            <el-button :icon="Plus" @click="toAdd"/>
            <el-button @click="reloadTable" :icon="RefreshRight"/>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>

    <el-table v-loading="data.loading" :data="data.list" style="width: 100%">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="uuid" label="uuid"/>
      <el-table-column prop="username" label="username"/>
      <el-table-column prop="password" label="password"/>
      <el-table-column prop="nickname" label="nickname"/>
      <el-table-column prop="avatar" label="avatar"/>
      <el-table-column prop="introduction" label="introduction"/>
      <el-table-column align="center">
        <template #header>
          <el-icon>
            <Setting/>
          </el-icon>
        </template>
        <template #default="scope">
          <el-button-group>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"/>
            <el-button size="small" :icon="Connection" @click="toRoles(scope.row)"/>
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
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
    />

  </el-card>

  <el-dialog
      v-model="data.dialog"
      :title="data.title"
      width="30%"
      :before-close="closeDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="form"
          :model="data.form" :rules="data.rules">
        <el-form-item v-if="data.type === 2" label="id" prop="id">
          <el-input v-model="data.form.id" disabled/>
        </el-form-item>
        <el-form-item label="username" prop="username">
          <el-input v-model="data.form.username" placeholder="username"/>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="data.form.password" placeholder="password"/>
        </el-form-item>
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="data.form.nickname" placeholder="nickname"/>
        </el-form-item>
        <el-form-item label="avatar" prop="avatar">
          <el-input v-model="data.form.avatar" placeholder="avatar"/>
        </el-form-item>
        <el-form-item label="introduction" prop="introduction">
          <el-input v-model="data.form.introduction" placeholder="introduction"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="data.fullscreen" type="primary"
            @click="data.type === 1 ? submit(form) : updateData(form)">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="data.roleDialog.show"
      title="角色"
      width="30%"
      :before-close="handleCloseRoleDialog"
  >
    <el-card v-loading="data.roleDialog.roleLoading">
      <el-form
          ref="roleForm"
          :model="data.roleDialog.form"
          :rules="data.roleDialog.rules"
      >
        <el-form-item prop="roles">
          <el-checkbox-group v-model="data.roleDialog.form.roles">
            <el-checkbox v-for="role in data.roleDialog.roles" :label="role" name="roles"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseRoleDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="data.fullscreen"
            type="primary" @click="submitRole(roleForm)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

.form-item {
  margin-bottom: 0;
}

</style>
