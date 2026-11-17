<template>
  <section>
    <div class="page-intro">
      <h2>题目管理</h2>
      <p>Web 基础知识题库，页面数据为演示内容。</p>
    </div>

    <div class="panel">
      <el-form :inline="true" :model="query" class="query-form" @submit.native.prevent>
        <el-form-item label="题目">
          <el-input
            v-model.trim="query.keyword"
            clearable
            placeholder="请输入题目关键词"
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
        <span class="table-title">题目列表</span>
        <el-tag size="small" type="info" effect="plain">共 {{ filtered.length }} 条</el-tag>
      </div>

      <el-table :data="paged" row-key="id" stripe empty-text="暂无匹配的题目">
        <el-table-column prop="date" label="日期" width="130" />
        <el-table-column prop="title" label="题目" min-width="300" show-overflow-tooltip />
        <el-table-column label="答案" min-width="150">
          <template slot-scope="{ row }">
            <el-tag size="small" type="success" effect="plain">{{ row.answer }}</el-tag>
          </template>
        </el-table-column>
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

    <el-dialog title="增加题目" :visible.sync="addVisible" width="480px">
      <el-form ref="addForm" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="题目" prop="title">
          <el-input v-model.trim="form.title" type="textarea" :rows="3" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model.trim="form.answer" placeholder="请输入正确答案" />
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
const questions = [
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
  data() {
    return {
      questions,
      query: { keyword: '' },
      keyword: '',
      page: 1,
      pageSize: 5,
      addVisible: false,
      form: { title: '', answer: '' },
      rules: {
        title: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }]
      }
    }
  },
  computed: {
    filtered() {
      const keyword = this.keyword
      return keyword ? this.questions.filter((item) => item.title.includes(keyword)) : this.questions
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
      this.form = { title: '', answer: '' }
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
