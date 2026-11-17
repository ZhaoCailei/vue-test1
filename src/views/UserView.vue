<template>
  <section>
    <div class="page-intro">
      <h2>用户管理</h2>
      <p>后台账号列表，页面数据为演示内容。</p>
    </div>

    <div class="panel">
      <el-form :inline="true" :model="query" class="query-form" @submit.native.prevent>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="query.keyword"
            clearable
            placeholder="请输入用户名"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-plus" @click="openAdd">增加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="panel">
      <div class="table-toolbar">
        <span class="table-title">用户列表</span>
        <el-tag size="small" type="info" effect="plain">共 {{ filtered.length }} 条</el-tag>
      </div>

      <el-table :data="paged" row-key="id" stripe empty-text="暂无匹配的用户">
        <el-table-column prop="date" label="日期" width="130" />
        <el-table-column prop="name" label="用户名" min-width="200" />
        <el-table-column prop="password" label="密码" min-width="160" />
        <el-table-column label="操作" width="130">
          <template slot-scope="{ row }">
            <el-button type="text" @click="notReady">编辑</el-button>
            <el-button type="text" class="danger-text" @click="notReady">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="app-pager">
        <el-pagination
          background
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 8, 10]"
          :total="filtered.length"
          layout="sizes, prev, pager, next, jumper"
          @current-change="page = $event"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <el-dialog title="增加用户" :visible.sync="addVisible" width="440px">
      <el-form ref="addForm" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
const users = [
  { id: 1, date: '2026-08-03', name: '沈星河', password: '123456' },
  { id: 2, date: '2026-08-06', name: '林晚晴', password: 'quiz0001' },
  { id: 3, date: '2026-08-11', name: '顾云舟', password: 'abc123' },
  { id: 4, date: '2026-08-15', name: '苏念安', password: '12345678' },
  { id: 5, date: '2026-08-19', name: '陆知行', password: 'quiz0005' },
  { id: 6, date: '2026-08-23', name: '白若溪', password: 'river123' },
  { id: 7, date: '2026-08-27', name: '程亦辰', password: '123456' },
  { id: 8, date: '2026-09-01', name: '唐语嫣', password: 'quiz0008' },
  { id: 9, date: '2026-09-05', name: '许清和', password: 'breeze01' },
  { id: 10, date: '2026-09-09', name: '江予棠', password: '123456' },
  { id: 11, date: '2026-09-14', name: '温以宁', password: 'quiz0011' },
  { id: 12, date: '2026-09-18', name: '秦书言', password: 'letter88' }
]

export default {
  name: 'UserView',
  data() {
    return {
      users,
      query: { keyword: '' },
      keyword: '',
      page: 1,
      pageSize: 5,
      addVisible: false,
      form: { name: '', password: '' },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度为 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少 6 位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    filtered() {
      const keyword = this.keyword
      return keyword ? this.users.filter((item) => item.name.includes(keyword)) : this.users
    },
    paged() {
      const start = (this.page - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  methods: {
    handleSearch() {
      this.keyword = this.query.keyword
      this.page = 1
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.page = 1
    },
    openAdd() {
      this.form = { name: '', password: '' }
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.clearValidate()
      })
    },
    handleAdd() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return
        this.addVisible = false
        this.$alert('暂时不能增加', '提示', { type: 'warning' })
      })
    },
    notReady() {
      this.$message.info('演示数据，暂不支持该操作')
    }
  }
}
</script>
