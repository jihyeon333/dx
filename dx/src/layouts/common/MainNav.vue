<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 아이콘 이미지 불러오기
import NavIcon01 from "@/assets/image/icon/nav_icon_01.svg";
import NavIcon02 from "@/assets/image/icon/nav_icon_02.svg";
import NavIcon03 from "@/assets/image/icon/nav_icon_03.svg";
import NavIcon04 from "@/assets/image/icon/nav_icon_04.svg";
import NavIcon05 from "@/assets/image/icon/nav_icon_05.svg";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleUp);

// 현재 라우트 가져오기
const route = useRoute();
const router = useRouter();

// 현재 경로가 특정 경로로 시작하는지 확인하는 computed 함수
const isActive = (path) => computed(() => route.path.startsWith(path));

// 실증솔루션 메뉴 활성화
const isSolutionActive = computed(() => route.path.includes('/user/Solution'));

// 페이지 리디렉션 처리
watch(
  () => route.path,
  (newPath) => {
    const redirects = {
      "/user/Data": "/user/Data/list",
      "/user/Device": "/user/Device",
      "/user/Solution": "/user/Solution",
      "/user/DTlink": "/user/DTlink",
    };

    if (redirects[newPath]) {
      router.replace(redirects[newPath]); // 현재 URL을 대체하여 이동
    }
  },
  { immediate: true } // 초기 실행
);
</script>

<template>
  <aside id="gnb">
    <nav class="gnb">
      <div class="depth1">
        <!-- 공정관리 -->
        <div class="dp1" :class="{ active: isActive('/user/Process').value }">
          <router-link to="/user/Process" class="da1">
            <i><img :src="NavIcon01" alt="공정관리"></i>
            <span>공정관리</span>
            <font-awesome-icon :icon="faAngleUp"></font-awesome-icon>
          </router-link>
        </div>

        <!-- 데이터관리 -->
        <div class="dp1" :class="{ active: isActive('/user/Data').value }">
          <router-link to="/user/Data" class="da1">
            <i><img :src="NavIcon02" alt="데이터관리"></i>
            <span>데이터관리</span>
            <font-awesome-icon :icon="faAngleUp"></font-awesome-icon>
          </router-link>
          <ul class="depth2" :class="{ open: isActive('/user/Data/').value }">
            <li>
              <i class="circle" :class="{ act: isActive('/user/Data/list').value }"></i>
              <router-link to="/user/Data/list">관리리스트</router-link>
            </li>
            <li>
              <i class="circle" :class="{ act: isActive('/user/Data/graph').value }"></i>
              <router-link to="/user/Data/graph">관리그래프</router-link>
            </li>
            <li>
              <i class="circle" :class="{ act: isActive('/user/Data/realtime').value }"></i>
              <router-link to="/user/Data/realtime">실시간</router-link>
            </li>
          </ul>
        </div>

        <!-- 장비관리 -->
        <div class="dp1" :class="{ active: isActive('/user/Device').value }">
          <router-link to="/user/Device" class="da1">
            <i><img :src="NavIcon03" alt="장비관리"></i>
            <span>장비관리</span>
          </router-link>
        </div>

        <!-- 실증솔루션 -->
        <div class="dp1" :class="{ active: isActive('/user/Solution').value, solutionActive: isSolutionActive.value }">
          <router-link to="/user/Solution" class="da1">
            <i><img :src="NavIcon04" alt="실증솔루션"></i>
            <span>실증솔루션</span>
          </router-link>
        </div>

        <!-- DT연계관리 -->
        <div class="dp1" :class="{ active: isActive('/user/DTlink').value }">
          <router-link to="/user/DTlink" class="da1">
            <i><img :src="NavIcon05" alt="DT연계관리"></i>
            <span>DT연계관리</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>
