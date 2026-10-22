<template>
  <el-container class="app-shell">
    <el-aside width="236px" class="app-aside">
      <div class="brand">
        <span class="brand-mark">Q</span>
        <span class="brand-copy">
          <strong>Quiz</strong>
          <small>后台管理系统</small>
        </span>
      </div>

      <el-menu
        :default-active="$route.path"
        :default-openeds="['system']"
        router
        class="side-menu"
        background-color="#121c33"
        text-color="#93a0bd"
        active-text-color="#ffffff"
      >
        <el-submenu index="system">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>系统信息管理</span>
          </template>
          <el-menu-item index="/users">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/questions">
            <i class="el-icon-document"></i>
            <span>题目管理</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>

      <div class="aside-footer">
        <p>Vue 2 · Element UI</p>
        <p>课程作业 · 静态演示数据</p>
      </div>
    </el-aside>

    <el-container class="app-body">
      <el-header height="76px" class="app-header">
        <div class="header-title">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h1>{{ $route.meta.title }}</h1>
        </div>

        <div class="header-meta">
          <el-tag size="small" effect="plain" type="warning">演示模式</el-tag>
          <el-avatar :size="36" class="header-avatar">Q</el-avatar>
          <div class="header-user">
            <strong>管理员</strong>
            <span>admin@quiz.demo</span>
          </div>
        </div>
      </el-header>

      <el-main class="app-main">
        <transition name="page-fade" mode="out-in">
          <router-view :key="$route.path" />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>
