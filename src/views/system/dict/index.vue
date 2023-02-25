<script setup>
import {reactive, onMounted, ref} from 'vue'
import {Search, Plus, Edit, Delete, Setting, List, RefreshRight} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {dictTable, create, update, remove, listTable, listCreate, listUpdate} from '@/api/dict'

const pageData = reactive({
  dictTable: {
    query: {
      name: '',
      page: 1,
      limit: 10,
    },
    list: [],
    total: 0,
    loading: true,
    dictAddDialog: false,
    title: '',
    type: 0,
    form: {
      id: 0,
      name: '',
      code: '',
    },
    fullscreen: false,
  },
  listTable: {
    query: {
      name: '',
      code: '',
      page: 1,
      limit: 10,
    },
    form: {
      id: 0,
      code: '',
      name: '',
      value: '',
    },
    list: [],
    total: 0,
    loading: false,
    listDialog: false,
    title: '',
    type: 0,
    fullscreen: false,
  }
})

const dictForm = ref()
const listForm = ref()

const dictRules = {
  name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
  code: [{required: true, message: 'Please input code ', trigger: 'blur'},]
}

const listRules = {
  name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
  value: [{required: true, message: 'Please input value ', trigger: 'blur'},],
}

const loadDictTableData = () => {
  pageData.dictTable.loading = true
  dictTable(pageData.dictTable.query)
      .then((res) => {
        pageData.dictTable.list = res.data.items
        pageData.dictTable.total = res.data.total
        console.log('res.data.items = ', res.data.items)
        ElMessage({message: `数据加载成功。一共 ${res.data.total} 条。`, type: 'success',})
      })
      .finally(() => {
        pageData.dictTable.loading = false
      })
}

const searchDictTable = () => {
  loadDictTableData()
}

const dictTableSizeChange = (limit) => {
  ElMessage('dictTableSizeChange')
  pageData.dictTable.query.limit = limit
  const maxPage = Math.ceil(pageData.dictTable.total / limit);
  if (maxPage < pageData.dictTable.query.page) {
    pageData.dictTable.query.page = maxPage
  }
  loadDictTableData()
}

const dictTableCurrentChange = (page) => {
  ElMessage('dictTableCurrentChange')
  pageData.dictTable.query.page = page
  loadDictTableData()
}

const closeDictDialog = () => {
  resetForm()
  pageData.dictTable.dictAddDialog = false
  ElMessage('取消了操作。')
}

const closeListDialog = () => {
  // resetListForm()
  pageData.listTable.listDialog = false
  resetListForm()
  ElMessage('取消了操作。')
}

const resetListForm = () => {
  pageData.listTable.form = {
    id: 0,
    code: '',
    name: '',
    value: '',
  }
}

const submitAddDict = (dictForm) => {
  dictForm.validate((valid) => {
    if (valid) {
      pageData.dictTable.fullscreen = true
      create(pageData.dictTable.form)
          .then((res) => {
            console.log('{...pageData.dictTable.form, id: res.data.id} = ', {
              ...pageData.dictTable.form,
              id: res.data.id
            })
            pageData.dictTable.list.push({...pageData.dictTable.form, id: res.data.id})
            pageData.dictTable.total += 1
            pageData.dictTable.dictAddDialog = false
            ElMessage({message: res.msg, type: 'success',})
            dictForm.resetFields()
          })
          .finally(() => {
            pageData.dictTable.fullscreen = false
          })
    }
  })
  // dictForm.resetFields()
}

const addDict = () => {
  pageData.dictTable.dictAddDialog = true
  pageData.dictTable.title = '添加字典'
  pageData.dictTable.type = 1
}

const handleDictEdit = (index, row) => {
  pageData.dictTable.dictAddDialog = true
  pageData.dictTable.title = '编辑字典'
  pageData.dictTable.type = 2
  pageData.dictTable.form = row
}

const updateDict = (dictForm) => {
  dictForm.validate((valid) => {
    if (valid) {
      pageData.dictTable.fullscreen = true
      update(pageData.dictTable.form)
          .then((res) => {
            pageData.dictTable.dictAddDialog = false
            resetForm()
            ElMessage({message: res.msg, type: 'success',})
          })
          .finally(() => {
            pageData.dictTable.fullscreen = false
          })
    }
  })
  // dictForm.resetFields()
}

const resetForm = () => {
  pageData.dictTable.form = {
    id: 0,
    name: '',
    code: '',
  }
}

const handleDictDelete = (index, row, flag) => {
  if (flag) {
    pageData.dictTable.loading = true
    remove({id: row.id})
        .then((response) => {
          pageData.dictTable.list.splice(index, 1)
          pageData.dictTable.total -= 1
          ElMessage({message: response.msg, type: 'success',})
        })
        .finally(() => {
          pageData.dictTable.loading = false
        })
  } else {
    ElMessage({type: 'info', message: '取消删除。',})
  }
}

const handleDictList = (index, row) => {
  pageData.listTable.query.code = row.code
  loadListTableData()
}

const reloadDictTable = () => {
  loadDictTableData()
}

const handleListTableSizeChange = (limit) => {
  ElMessage('handleListTableSizeChange')
  pageData.listTable.query.limit = limit
  const maxPage = Math.ceil(pageData.listTable.total / limit);
  if (maxPage < pageData.listTable.query.page) {
    pageData.listTable.query.page = maxPage
  }
  loadListTableData()
}

const handleListTableCurrentChange = (page) => {
  ElMessage('handleListTableCurrentChange')
  pageData.listTable.query.page = page
  loadListTableData()
}

const searchListTable = () => {
  ElMessage('searchListTable')
  loadListTableData()
}

const reloadListTable = () => {
  ElMessage('reloadListTable')
  loadListTableData()
}

const addList = () => {
  ElMessage('addList')
  if (pageData.listTable.query.code) {
    pageData.listTable.listDialog = true
    pageData.listTable.title = '添加字典数据'
    pageData.listTable.type = 1
    pageData.listTable.form.code = pageData.listTable.query.code
  } else {
    ElMessage('pageData.listTable.query.code')
  }
}

const submitAddList = (listForm) => {
  listForm.validate((valid) => {
    if (valid) {
      pageData.listTable.fullscreen = true
      listCreate(pageData.listTable.form)
          .then((res) => {
            pageData.listTable.list.push({...pageData.listTable.form, id: res.data.id})
            pageData.listTable.total += 1
            ElMessage({message: res.msg, type: 'success',})
            listForm.resetFields()
          })
          .finally(() => {
            pageData.listTable.listDialog = false
            pageData.listTable.fullscreen = false
          })
    }
  })
  ElMessage('submitAddList')
}

const updateList = (listForm) => {
  ElMessage('updateList')
  pageData.listTable.fullscreen = true
  listUpdate(pageData.listTable.form)
      .then((res) => {
        pageData.listTable.listDialog = false
        resetListForm()
        ElMessage({message: res.msg, type: 'success',})
      })
      .finally(() => {
        pageData.listTable.fullscreen = false
      })
}

const loadListTableData = () => {
  ElMessage('loadListTableData')
  // listTable()
  if (pageData.listTable.query.code) {
    pageData.listTable.loading = true
    listTable(pageData.listTable.query)
        .then((res) => {
          pageData.listTable.list = res.data.items
          pageData.listTable.total = res.data.total
        })
        .finally(() => {
          pageData.listTable.loading = false
        })
  } else {
    ElMessage('pageData.listTable.query.code')
  }
}

const handleListEdit = (index, row) => {
  ElMessage('handleListEdit')
  pageData.listTable.listDialog = true
  pageData.listTable.title = '编辑字典'
  pageData.listTable.type = 2
  pageData.listTable.form = row
}

const handleListDelete = (index, row, flag) => {
  ElMessage('handleListDelete')
}

onMounted(() => {
  loadDictTableData()
  // loadListTableData()
})

</script>

<template>
  <el-row>
    <el-col :span="11">
      <el-card>
        <template #header>
          <el-form :inline="true" :model="pageData.dictTable.query" class="demo-form-inline">
            <el-form-item class="form-item">
              <el-input v-model="pageData.dictTable.query.name" placeholder="name"/>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button :loading="pageData.dictTable.loading" @click="searchDictTable" :icon="Search"></el-button>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button-group>
                <el-button @click="addDict" :icon="Plus"></el-button>
                <el-button :loading="pageData.dictTable.loading" :icon="RefreshRight" @click="reloadDictTable"/>
              </el-button-group>
            </el-form-item>
          </el-form>
        </template>
        <el-table :data="pageData.dictTable.list" v-loading="pageData.dictTable.loading">
          <el-table-column prop="id" label="id"/>
          <el-table-column prop="name" label="name"/>
          <el-table-column prop="code" label="code"/>
          <el-table-column align="center">
            <template #header>
              <el-icon>
                <Setting/>
              </el-icon>
            </template>
            <template #default="scope">
              <el-button-group>
                <el-button size="small" @click="handleDictEdit(scope.$index, scope.row)" :icon="Edit"/>
                <el-button size="small" @click="handleDictList(scope.$index, scope.row)" :icon="List"/>
                <el-popconfirm
                    title="确定要删除这条数据？此操作不可以逆。"
                    confirm-button-type="danger"
                    @confirm="handleDictDelete(scope.$index, scope.row, true)"
                    @cancel="handleDictDelete(scope.$index, scope.row, false)">
                  <template #reference>
                    <el-button size="small" type="danger" :icon="Delete"/>
                  </template>
                </el-popconfirm>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageData.dictTable.query.page"
            v-model:page-size="pageData.dictTable.query.limit"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.dictTable.total"
            @size-change="dictTableSizeChange"
            @current-change="dictTableCurrentChange"
            style="margin-top: 15px"
        />
      </el-card>
    </el-col>
    <el-col :span="12" :offset="1">
      <el-card>
        <template #header>
          <el-form :inline="true" :model="pageData.listTable.query" class="demo-form-inline">
            <el-form-item class="form-item">
              <el-input v-model="pageData.listTable.query.code" disabled placeholder="请从左侧选择一个字典类型"/>
            </el-form-item>
            <el-form-item class="form-item">
              <el-input v-model="pageData.listTable.query.name" placeholder="name"/>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button :loading="pageData.listTable.loading" @click="searchListTable" :icon="Search"></el-button>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button-group>
                <el-button @click="addList" :icon="Plus"></el-button>
                <el-button :loading="pageData.listTable.loading" :icon="RefreshRight" @click="reloadListTable"/>
              </el-button-group>
            </el-form-item>
          </el-form>
        </template>
        <el-table :data="pageData.listTable.list" v-loading="pageData.listTable.loading">
          <el-table-column prop="id" label="id"/>
          <el-table-column prop="code" label="code"/>
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
                <el-button size="small" @click="handleListEdit(scope.$index, scope.row)" :icon="Edit"/>
                <el-popconfirm
                    title="确定要删除这条数据？此操作不可以逆。"
                    confirm-button-type="danger"
                    @confirm="handleListDelete(scope.$index, scope.row, true)"
                    @cancel="handleListDelete(scope.$index, scope.row, false)">
                  <template #reference>
                    <el-button size="small" type="danger" :icon="Delete"/>
                  </template>
                </el-popconfirm>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageData.listTable.query.page"
            v-model:page-size="pageData.listTable.query.limit"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.listTable.total"
            @size-change="handleListTableSizeChange"
            @current-change="handleListTableCurrentChange"
            style="margin-top: 15px"
        />
      </el-card>
    </el-col>
  </el-row>

  <el-dialog
      v-model="pageData.dictTable.dictAddDialog"
      :title="pageData.dictTable.title"
      width="30%"
      :before-close="closeDictDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="dictForm"
          :model="pageData.dictTable.form" :rules="dictRules">
        <el-form-item v-if="pageData.dictTable.type === 2" label="id" prop="id">
          <el-input v-model="pageData.dictTable.form.id" disabled/>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="pageData.dictTable.form.name" placeholder="name"/>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="pageData.dictTable.form.code" placeholder="code"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDictDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="pageData.dictTable.fullscreen" type="primary"
            @click="pageData.dictTable.type === 1 ? submitAddDict(dictForm) : updateDict(dictForm)">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="pageData.listTable.listDialog"
      :title="pageData.listTable.title"
      width="30%"
      :before-close="closeListDialog"
  >
    <el-card>
      <el-form
          label-position="top" ref="listForm"
          :model="pageData.listTable.form"
          :rules="listRules">
        <el-form-item v-if="pageData.listTable.type === 2" label="id" prop="id">
          <el-input v-model="pageData.listTable.form.id" disabled/>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="pageData.listTable.form.code" disabled placeholder="code"/>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="pageData.listTable.form.name" placeholder="name"/>
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input v-model="pageData.listTable.form.value" placeholder="value"/>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeListDialog">取消</el-button>
        <el-button
            v-loading.fullscreen.lock="pageData.listTable.fullscreen" type="primary"
            @click="pageData.listTable.type === 1 ? submitAddList(listForm) : updateList(listForm)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

.form-item {
  margin-bottom: 0;
}

</style>
