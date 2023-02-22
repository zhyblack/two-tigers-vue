<script setup>
import {reactive, onMounted, ref} from 'vue'
import {Search, Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {dictTable, create} from '@/api/dict'

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
      name: '',
      code: '',
    },
    fullscreen: false,
  }
})

const dictForm = ref()

const dictRules = {
  name: [{required: true, message: 'Please input name ', trigger: 'blur'},],
  code: [{required: true, message: 'Please input code ', trigger: 'blur'},]
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

const dictTableSizeChange = () => {

}

const dictTableCurrentChange = () => {

}

const closeDictDialog = () => {
  dictForm.value.resetFields()
  pageData.dictTable.dictAddDialog = false
  ElMessage('取消了操作。')
}

const submitAddDict = (dictForm) => {
  pageData.dictTable.fullscreen = true
  create(pageData.dictTable.form)
      .then((res) => {
        console.log('{...pageData.dictTable.form, id: res.data.id} = ', {...pageData.dictTable.form, id: res.data.id})
        pageData.dictTable.list.push({...pageData.dictTable.form, id: res.data.id})
        pageData.dictTable.total += 1
        pageData.dictTable.dictAddDialog = false
        ElMessage({message: res.msg, type: 'success',})
        dictForm.resetFields()
      })
      .finally(() => {
        pageData.dictTable.fullscreen = false
      })
  // dictForm.resetFields()
}

const addDict = () => {
  pageData.dictTable.dictAddDialog = true
  pageData.dictTable.title = '添加字典'
  pageData.dictTable.type = 1
}

onMounted(() => {
  loadDictTableData()
})

</script>

<template>
  <el-row>
    <el-col :span="11">
      <el-card>
        <template #header>
          <el-form :inline="true" :model="pageData.dictTable.query" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="pageData.dictTable.query.name" placeholder="name"/>
            </el-form-item>
            <el-form-item>
              <el-button :loading="pageData.dictTable.loading" @click="searchDictTable" :icon="Search"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="addDict" :icon="Plus"></el-button>
            </el-form-item>
          </el-form>
        </template>
        <el-table :data="pageData.dictTable.list" v-loading="pageData.dictTable.loading">
          <el-table-column prop="id" label="id"/>
          <el-table-column prop="name" label="name"/>
          <el-table-column prop="code" label="code"/>
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
    <!--    <el-col :span="12" :offset="1">
          <el-card>
            <template #header>
              <el-form :inline="true" :model="pageData.query" class="demo-form-inline">
                <el-form-item>
                  <el-input v-model="pageData.query.name" placeholder="name"/>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchTable" :icon="Search"></el-button>
                </el-form-item>
              </el-form>
            </template>
            <el-table :data="tableData">
              <el-table-column prop="date" label="Date" width="180"/>
              <el-table-column prop="name" label="Name" width="180"/>
              <el-table-column prop="address" label="Address"/>
            </el-table>
            <el-pagination
                v-model:current-page="currentPage4"
                v-model:page-size="pageSize4"
                :page-sizes="[100, 200, 300, 400]"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                style="margin-top: 15px"
            />
          </el-card>
        </el-col>-->
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
            @click="submitAddDict(dictForm)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
