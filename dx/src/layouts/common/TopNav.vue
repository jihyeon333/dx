<script setup>
import { useRouter, useRoute } from "vue-router";
import { defineEmits } from 'vue';
import '@/assets/styles/views/login.scss';
import pomiaHeaderLogo from '@/assets/image/pomia_Header_logo.svg';

const emits = defineEmits(["login", "logout"]);
const router = useRouter();
const route = useRoute();

// 로그아웃 처리 함수
const triggerLogout = () => {
  emits("logout");
};

// 현재 경로가 해당 경로로 시작하는지 체크하는 함수
const isActive = (path) => route.path.startsWith(path);

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
          <img :src="pomiaHeaderLogo" alt="pomia">
          <span class="skip">포미아 로고</span>
          <b>DX 플랫폼</b>
        </h1>
      </div>
      <nav class="gnb">
        <ul class="nav-list">
          <!-- 공정관리 링크 -->
          <li class="menu" :class="{ active: isActive('/user/Process/') }">
            <a href="#" @click.prevent="goToPage('/user/Process/')">공정관리</a>
          </li>

          <!-- 데이터관리 링크 -->
          <li class="menu" :class="{ active: isActive('/user/Data/') }">
            <a href="#" @click.prevent="goToPage('/user/Data/')">데이터관리</a>
          </li>

          <!-- 장비관리 링크 -->
          <li class="menu" :class="{ active: isActive('/user/Device/') }">
            <a href="#" @click.prevent="goToPage('/user/Device/')">장비관리</a>
          </li>

          <!-- 실증솔루션 연계관리 링크 -->
          <li class="menu" :class="{ active: isActive('/user/Solution') }">
            <a href="#" @click.prevent="goToPage('/user/Solution/')">실증솔루션 연계관리</a>
          </li>

          <!-- DT 연계관리 링크 -->
          <li class="menu" :class="{ active: isActive('/user/DTlink/') }">
            <a href="#" @click.prevent="goToPage('/user/DTlink/')">DT연계관리</a>
          </li>
        </ul>
      </nav>
      <div class="right">
        <ul class="link-list">
          <!-- DX플랫폼 소개 링크 -->
          <li class="link" :class="{ active: isActive('/') }">
            <router-link to="/">DX플랫폼 소개</router-link>
          </li>

          <!-- 마이페이지 링크 -->
          <li class="link" :class="{ active: isActive('/about') }">
            <router-link to="/about">마이페이지</router-link>
          </li>

          <!-- 로그아웃 링크 -->
          <li class="link">
            <router-link to="/login" @click="triggerLogout">로그아웃</router-link>
          </li>

          <!-- 문의하기 링크 -->
          <li class="link" :class="{ active: isActive('/contact') }">
            <router-link to="/contact">문의하기</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
