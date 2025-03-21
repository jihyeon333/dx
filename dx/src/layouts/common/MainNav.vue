<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 아이콘 이미지 불러오기
import NavIcon01 from "@/assets/image/icon/nav_icon_01.svg";
import NavIcon02 from "@/assets/image/icon/nav_icon_02.svg";
import NavIcon03 from "@/assets/image/icon/nav_icon_03.svg";
import NavIcon04 from "@/assets/image/icon/nav_icon_04.svg";
import NavIcon05 from "@/assets/image/icon/nav_icon_05.svg";

import MypageIcon01 from "@/assets/image/icon/mapage_icon01.svg";
import MypageIcon02 from "@/assets/image/icon/mapage_icon02.svg";
import MypageIcon03 from "@/assets/image/icon/mapage_icon03.svg";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleUp);

const props = defineProps({
  isMypage: Boolean, //  마이페이지 여부를 받아옴
});

const route = useRoute();
const router = useRouter();
const user = computed(() => JSON.parse(localStorage.getItem("user") ?? "{}"));
const isAdmin = computed(() => user.value.role === "admin");

const isActive = (path) => computed(() => route.path.startsWith(path));

//  기존 페이지에서 특정 경로로 자동 리디렉션 유지
watch(
  () => route.path,
  (newPath) => {
    const redirects = {
      "/user/process": "/user/process",
      "/user/data": "/user/data",
      "/user/device": "/user/device",
      "/user/solution": "/user/solution",
      "/user/dtLink": "/user/dtLink",
    };

    if (redirects[newPath]) {
      router.replace(redirects[newPath]); // 현재 URL을 대체하여 이동
    }
  },
  { immediate: true } // 초기 실행
);

//  마이페이지 여부를 computed로 변경하여 동적 적용
const isMypage = computed(() => route.path.startsWith("/mypage") || route.path.startsWith("/admin/mypage"));
</script>

<template>
  <aside id="gnb" class="main-nav">
    <nav class="gnb">
      <!--  일반 페이지 네비게이션 (마이페이지 아닐 때) -->
      <div class="depth1" v-if="!isMypage">
        <div class="dp1" :class="{ active: isActive('/user/process').value }">
          <router-link to="/user/process" class="da1">
            <i><img :src="NavIcon01" alt="공정관리"></i>
            <span>공정관리</span>
          </router-link>
        </div>

        <div class="dp1" :class="{ active: isActive('/user/data').value }">
          <router-link to="/user/data" class="da1">
            <i><img :src="NavIcon02" alt="데이터관리"></i>
            <span>데이터관리</span>
            <font-awesome-icon :icon="faAngleUp"></font-awesome-icon>
          </router-link>
          <ul class="depth2" :class="{ open: isActive('/user/data/').value }">
            <li>
              <i class="circle" :class="{ active: isActive('/user/data/list').value }"></i>
              <router-link to="/user/data/list">관리리스트</router-link>
            </li>
            <li>
              <i class="circle" :class="{ active: isActive('/user/data/graph').value }"></i>
              <router-link to="/user/data/graph">관리그래프</router-link>
            </li>
            <li>
              <i class="circle" :class="{ active: isActive('/user/data/realtime').value }"></i>
              <router-link to="/user/data/realtime">실시간</router-link>
            </li>
          </ul>
        </div>

        <div class="dp1" :class="{ active: isActive('/user/device').value }">
          <router-link to="/user/device" class="da1">
            <i><img :src="NavIcon03" alt="장비관리"></i>
            <span>장비관리</span>
          </router-link>
        </div>

        <div class="dp1" :class="{ active: isActive('/user/solution').value }">
          <router-link to="/user/solution" class="da1">
            <i><img :src="NavIcon04" alt="실증솔루션"></i>
            <span>실증솔루션</span>
          </router-link>
        </div>

        <div class="dp1" :class="{ active: isActive('/user/dtLink').value }">
          <router-link to="/user/dtLink" class="da1">
            <i><img :src="NavIcon05" alt="DT연계관리"></i>
            <span>DT연계관리</span>
          </router-link>
        </div>
      </div>

      <!--  마이페이지 전용 네비게이션 -->
      <div class="depth1" v-if="isMypage">
        <!-- 관리자 전용 메뉴 -->
        <div class="dp1" v-if="isAdmin" :class="{ active: isActive('/admin/mypage/userlist').value }">
          <router-link to="/admin/mypage/userlist" class="da1">
            <i><img :src="MypageIcon01" alt="회원관리"></i>
            <span>회원관리</span>
          </router-link>
        </div>
        <div class="dp1" v-if="isAdmin" :class="{ active: isActive('/admin/mypage/approval').value }">
          <router-link to="/admin/mypage/approval" class="da1">
            <i><img :src="MypageIcon02" alt="사용자 승인관리"></i>
            <span>사용자 승인관리</span>
          </router-link>
        </div>
        <div class="dp1" v-if="isAdmin" :class="{ active: isActive('/admin/mypage/usage').value }">
          <router-link to="/admin/mypage/usage" class="da1">
            <i><img :src="MypageIcon03" alt="사용정보"></i>
            <span>사용정보</span>
          </router-link>
        </div>
        <!-- 사용자 전용 메뉴  -->
        <div class="dp1" :class="{ active: isActive('/user/mypage/profile').value }">
          <router-link to="/user/mypage/profile" class="da1">
            <i><img :src="MypageIcon01" alt="개인정보"></i>
            <span>개인정보</span>
          </router-link>
        </div>
        <div class="dp1" :class="{ active: isActive('/user/mypage/usage').value }">
          <router-link to="/user/mypage/usage" class="da1">
            <i><img :src="MypageIcon03" alt="사용정보"></i>
            <span>사용정보</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>
