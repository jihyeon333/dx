<script setup>
import { ref, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import '@/assets/styles/views/login.scss';
import pomiaLogo from '@/assets/image/pomia_logo.svg';
import LoginForm from '@/components/Login/LoginForm.vue';
import Alert from '@/components/common/Alert.vue';

const router = useRouter();
const emits = defineEmits(["login"]); //  부모(App.vue)로 로그인 이벤트 전달
const loginError = ref(false);
const loginErrorMessage = ref("");

//  로그인 탭 상태 유지
const tabs = ['일반 로그인', '관리자 로그인'];
const activeTab = ref(localStorage.getItem("activeTab") || tabs[0]); //  localStorage에서 초기값 가져오기
watch(activeTab, (newTab) => {
    if (!tabs.includes(newTab)) {
        activeTab.value = tabs[0]; // 강제로 첫 번째 탭으로 설정
    } else {
        localStorage.setItem("activeTab", newTab); // 유효하면 저장
    }
});

//  로그인 에러 핸들링
const setError = ({ error, message }) => {
    loginError.value = false;
    setTimeout(() => {
        loginError.value = error;
        loginErrorMessage.value = message;
    }, 10);
};

//  로그인 성공 시 실행
const handleLoginSuccess = ({ userType }) => {
    emits("login"); //  App.vue의 `handleLogin()` 실행
    localStorage.setItem("activeTab", activeTab.value); //  로그인 후에도 activeTab 유지
    if (userType === "admin") {
        router.push("/admin");
    } else {
        router.push("/user");
    }
};
</script>

<template>
    <div class="login-wrap">
        <div class="login-box">
            <section class="logo">
                <div class="img">
                    <img :src="pomiaLogo" alt="pomia">
                    <span class="skip">포미아 로고</span>
                </div>
            </section>

            <!--  로그인 탭 (localStorage로 유지) -->
            <section class="tab-container">
                <div class="tabs">
                    <button v-for="(tab, index) in tabs" :key="index" :class="{ tab: true, active: activeTab === tab }"
                        @click="activeTab = tab">
                        {{ tab }}
                    </button>
                </div>
            </section>

            <section class="form">
                <LoginForm @updateError="setError" @loginSuccess="handleLoginSuccess"
                    :isAdmin="activeTab === '관리자 로그인'" />
            </section>
        </div>

        <Alert :message="loginErrorMessage" type="error" :visible="loginError"
            @update:visible="() => { loginError = false; loginErrorMessage = ''; }" customClass="loginAlert" />
    </div>
</template>
