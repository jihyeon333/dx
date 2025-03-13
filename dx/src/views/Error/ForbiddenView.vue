<template>
  <div class="error-page">
    <h1>403 Forbidden</h1>
    <p>접근 권한이 없습니다.</p>
    <router-link to="/user/dashboard">사용자 대시보드로 돌아가기</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 50px;
}
</style>
