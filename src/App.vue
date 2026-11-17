<template>
  <el-container class="app-shell">
    <el-aside width="220px" class="app-aside">
      <div class="brand">
        <span class="brand-mark">Q</span>
        <span>Quiz 后台管理系统</span>
      </div>

      <div class="menu-group">系统信息管理</div>

      <el-menu
        :default-active="$route.path"
        router
        class="side-menu"
        background-color="#121c33"
        text-color="#93a0bd"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/questions">
          <i class="el-icon-document"></i>
          <span>题目管理</span>
        </el-menu-item>
      </el-menu>

      <div class="aside-footer">Vue 2 + Element UI 课程作业</div>
    </el-aside>

    <el-container>
      <el-header height="60px" class="app-header">
        <el-breadcrumb separator="/" class="header-breadcrumb">
          <el-breadcrumb-item>系统信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-user">
          <el-avatar :size="30">管</el-avatar>
          <span>管理员</span>
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>
