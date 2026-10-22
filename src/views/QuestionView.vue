<template>
  <section class="manage-page">
    <div class="page-intro">
      <div>
        <h2>题目管理</h2>
        <p>维护 Web 基础知识题库，当前页面使用静态演示数据。</p>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="openCreate">添加题目</el-button>
    </div>

    <div class="panel query-panel">
      <div class="panel-title">查询题目</div>
      <el-form :inline="true" :model="query" class="query-form" @submit.native.prevent>
        <el-form-item label="题目">
          <el-input
            v-model.trim="query.keyword"
            clearable
            placeholder="请输入题目关键词"
            prefix-icon="el-icon-search"
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
          <span>题目列表</span>
          <el-tag size="mini" type="info" effect="plain">共 {{ filteredQuestions.length }} 条</el-tag>
        </div>
        <span class="table-hint">数据为演示内容，未连接数据库</span>
      </div>

      <el-table
        :data="pagedQuestions"
        row-key="id"
        stripe
        class="data-table"
        empty-text="暂无匹配的题目"
      >
        <el-table-column prop="date" label="日期" width="150" />
        <el-table-column prop="title" label="题目" min-width="340" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span class="question-text">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="答案" min-width="180">
          <template slot-scope="{ row }">
            <el-tag size="small" effect="plain" type="success">{{ row.answer }}</el-tag>
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
        :total="filteredQuestions.length"
        :page="page"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog
      :title="dialogMode === 'create' ? '添加题目' : '编辑题目'"
      :visible.sync="dialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="questionForm" :model="form" :rules="rules" label-width="76px">
        <el-form-item label="题目" prop="title">
          <el-input
            v-model.trim="form.title"
            type="textarea"
            :rows="3"
            maxlength="120"
            show-word-limit
            placeholder="请输入题目内容，例如：HTML 中用于创建超链接的标签是？"
          />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model.trim="form.answer" placeholder="请输入正确答案" maxlength="60" />
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

const buildQuestions = () => [
  { id: 1, date: '2026-08-04', title: 'HTML 中用于创建超链接的标签是？', answer: '<a>' },
  { id: 2, date: '2026-08-07', title: 'CSS 中用于设置文字颜色的属性是？', answer: 'color' },
  { id: 3, date: '2026-08-12', title: 'JavaScript 中声明块级作用域常量的关键字是？', answer: 'const' },
  { id: 4, date: '2026-08-16', title: 'HTTP 状态码 404 表示什么？', answer: '请求的资源未找到' },
  { id: 5, date: '2026-08-20', title: '下列哪个不是 HTML5 语义化标签？', answer: '<center>' },
  { id: 6, date: '2026-08-24', title: 'CSS 盒模型由 content、padding、border 和什么组成？', answer: 'margin' },
  { id: 7, date: '2026-08-28', title: 'Vue 中实现表单双向绑定的指令是？', answer: 'v-model' },
  { id: 8, date: '2026-09-02', title: '关闭浏览器后，localStorage 中的数据会消失吗？', answer: '不会' },
  { id: 9, date: '2026-09-06', title: 'JavaScript 中 === 运算符的特点是什么？', answer: '严格相等，不做类型转换' },
  { id: 10, date: '2026-09-10', title: '哪个 CSS 属性可以开启弹性布局？', answer: 'display: flex' },
  { id: 11, date: '2026-09-15', title: 'script 标签的 defer 属性有什么作用？', answer: '延迟到文档解析完成后按顺序执行' },
  { id: 12, date: '2026-09-19', title: '下列哪个单位最适合做移动端响应式布局？', answer: 'vw' }
]

export default {
  name: 'QuestionView',
  components: { AppPager },
  data() {
    return {
      query: { keyword: '' },
      appliedKeyword: '',
      page: 1,
      pageSize: 5,
      questions: buildQuestions(),
      dialogVisible: false,
      dialogMode: 'create',
      editingId: null,
      form: { title: '', answer: '' },
      rules: {
        title: [
          { required: true, message: '请输入题目内容', trigger: 'blur' },
          { min: 4, message: '题目内容至少 4 个字符', trigger: 'blur' }
        ],
        answer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }]
      }
    }
  },
  computed: {
    filteredQuestions() {
      const keyword = this.appliedKeyword.trim()
      if (!keyword) return this.questions
      return this.questions.filter((item) => item.title.includes(keyword))
    },
    pagedQuestions() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredQuestions.slice(start, start + this.pageSize)
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
      this.form = { title: row.title, answer: row.answer }
      this.dialogVisible = true
    },
    resetForm() {
      this.form = { title: '', answer: '' }
      this.editingId = null
      this.$nextTick(() => {
        if (this.$refs.questionForm) this.$refs.questionForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs.questionForm.validate((valid) => {
        if (!valid) return
        this.dialogVisible = false
        this.$alert('还没有连接数据库', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除题目「${row.title}」吗？`, '删除确认', {
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
