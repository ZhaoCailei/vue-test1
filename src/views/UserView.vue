<template>
  <section class="manage-page">
    <div class="page-intro">
      <div>
        <h2>用户管理</h2>
        <p>查看并维护后台账号信息，当前页面使用静态演示数据。</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openCreate">添加用户</el-button>
    </div>

    <div class="panel query-panel">
      <div class="panel-title">查询用户</div>
      <el-form :inline="true" :model="query" class="query-form" @submit.native.prevent>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="query.keyword"
            clearable
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="panel">
      <div class="table-toolbar">
        <div class="table-title">
          <span>用户列表</span>
          <el-tag size="mini" type="info" effect="plain">共 {{ filteredUsers.length }} 条</el-tag>
        </div>
        <span class="table-hint">数据为演示内容，未连接数据库</span>
      </div>

      <el-table
        :data="pagedUsers"
        row-key="id"
        stripe
        class="data-table"
        empty-text="暂无匹配的用户"
      >
        <el-table-column prop="date" label="日期" width="150" />
        <el-table-column label="用户" min-width="180">
          <template slot-scope="{ row }">
            <div class="user-cell">
              <span class="user-avatar">{{ row.name.slice(0, 1) }}</span>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="密码" min-width="160">
          <template slot-scope="{ row }">
            <code class="password">{{ row.password }}</code>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="{ row }">
            <el-button type="text" icon="el-icon-edit" @click="openEdit(row)">编辑</el-button>
            <el-button type="text" class="danger-text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <app-pager
        :total="filteredUsers.length"
        :page="page"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog
      :title="dialogMode === 'create' ? '添加用户' : '编辑用户'"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="userForm" :model="form" :rules="rules" label-width="92px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入用户名" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" maxlength="24" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码" maxlength="24" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import AppPager from '../components/AppPager.vue'

const buildUsers = () => [
  { id: 1, date: '2026-08-03', name: '沈星河', password: 'Starry#406' },
  { id: 2, date: '2026-08-06', name: '林晚晴', password: 'Sunset@127' },
  { id: 3, date: '2026-08-11', name: '顾云舟', password: 'Cloud_8824' },
  { id: 4, date: '2026-08-15', name: '苏念安', password: 'AnAn!2026' },
  { id: 5, date: '2026-08-19', name: '陆知行', password: 'Know#771' },
  { id: 6, date: '2026-08-23', name: '白若溪', password: 'River*553' },
  { id: 7, date: '2026-08-27', name: '程亦辰', password: 'Morning@90' },
  { id: 8, date: '2026-09-01', name: '唐语嫣', password: 'Whisper#31' },
  { id: 9, date: '2026-09-05', name: '许清和', password: 'Breeze_617' },
  { id: 10, date: '2026-09-09', name: '江予棠', password: 'Blossom#42' },
  { id: 11, date: '2026-09-14', name: '温以宁', password: 'Peace@518' },
  { id: 12, date: '2026-09-18', name: '秦书言', password: 'Letter#809' }
]

export default {
  name: 'UserView',
  components: { AppPager },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      query: { keyword: '' },
      appliedKeyword: '',
      page: 1,
      pageSize: 5,
      users: buildUsers(),
      dialogVisible: false,
      dialogMode: 'create',
      editingId: null,
      form: { name: '', password: '', confirmPassword: '' },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度为 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少 6 位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    filteredUsers() {
      const keyword = this.appliedKeyword.trim()
      if (!keyword) return this.users
      return this.users.filter((user) => user.name.includes(keyword))
    },
    pagedUsers() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredUsers.slice(start, start + this.pageSize)
    }
  },
  methods: {
    handleSearch() {
      this.appliedKeyword = this.query.keyword
      this.page = 1
    },
    handleReset() {
      this.query.keyword = ''
      this.appliedKeyword = ''
      this.page = 1
    },
    handlePageChange(page) {
      this.page = page
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.page = 1
    },
    openCreate() {
      this.resetForm()
      this.dialogMode = 'create'
      this.dialogVisible = true
    },
    openEdit(row) {
      this.resetForm()
      this.dialogMode = 'edit'
      this.editingId = row.id
      this.form = {
        name: row.name,
        password: row.password,
        confirmPassword: row.password
      }
      this.dialogVisible = true
    },
    resetForm() {
      this.form = { name: '', password: '', confirmPassword: '' }
      this.editingId = null
      this.$nextTick(() => {
        if (this.$refs.userForm) this.$refs.userForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (!valid) return
        this.dialogVisible = false
        this.$alert('还没有连接数据库', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除用户「${row.name}」吗？`, '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$alert('还没有连接数据库', '提示', {
            confirmButtonText: '知道了',
            type: 'warning'
          })
        })
        .catch(() => {})
    }
  }
}
</script>
