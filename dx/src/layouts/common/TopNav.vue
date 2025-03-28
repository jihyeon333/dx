<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import { defineEmits } from "vue";
import "@/assets/styles/views/login.scss";
import pomiaHeaderLogo from "@/assets/image/pomia_Header_logo.svg";

const emits = defineEmits(["login", "logout"]);
const router = useRouter();
const route = useRoute();

const user = computed(() => JSON.parse(localStorage.getItem("user") ?? "{}"));
const isAdmin = computed(() => user.value.role === "admin");

// 현재 경로가 해당 경로로 시작하는지 정확히 체크하는 함수
const isMypageRoute = computed(() => {
  return route.path.startsWith("/user/mypage") || route.path.startsWith("/admin/mypage");
});

const mypagePath = computed(() => (isAdmin.value ? "/admin/mypage" : "/user/mypage"));

const isActive = (path) => route.path.startsWith(path);

// 로그아웃 처리 함수
const triggerLogout = () => {
  emits("logout");
};

// 페이지 이동 함수 (router.push 사용)
const goToPage = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="top-nav">
    <div class="nav-wrap">
      <div class="left">
        <h1 class="logo">
          <img :src="pomiaHeaderLogo" alt="pomia" />
          <span class="skip">포미아 로고</span>
          <b>DX 플랫폼</b>
        </h1>
      </div>
      <nav class="gnb">
        <ul class="nav-list">
          <li class="menu" :class="{ active: isActive('/user/process') }">
            <a href="#" @click.prevent="goToPage('/user/process')">공정관리</a>
          </li>
          <li class="menu" :class="{ active: isActive('/user/data') }">
            <a href="#" @click.prevent="goToPage('/user/data')">데이터관리</a>
          </li>
          <li class="menu" :class="{ active: isActive('/user/device') }">
            <a href="#" @click.prevent="goToPage('/user/device')">장비관리</a>
          </li>
          <li class="menu" :class="{ active: isActive('/user/solution') }">
            <a href="#" @click.prevent="goToPage('/user/solution')">실증솔루션 연계관리</a>
          </li>
          <li class="menu" :class="{ active: isActive('/user/dtLink') }">
            <a href="#" @click.prevent="goToPage('/user/dtLink')">DT연계관리</a>
          </li>
        </ul>
      </nav>
      <div class="right">
        <ul class="link-list">
          <li class="link" :class="{ active: isActive('/intro') }">
            <router-link to="/">DX플랫폼 소개</router-link>
          </li>

          <!-- 마이페이지 링크 (사용자 유형에 따라 다르게 설정) -->
          <li class="link" :class="{ active: isMypageRoute }">
            <router-link :to="mypagePath">마이페이지</router-link>
          </li>

          <li class="link">
            <router-link to="/auth/login" @click="triggerLogout">로그아웃</router-link>
          </li>

          <li class="link" :class="{ active: isActive('/contact') }">
            <router-link to="/contact">문의하기</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
