<template>
  <div style="padding:30px;">
    <el-alert :closable="true" title="menu 1">
      <p>
        hello
      </p>
      <router-view />
      <!-- 里面继续嵌入router-view内部的套件 -->
    </el-alert>
  </div>
</template>
