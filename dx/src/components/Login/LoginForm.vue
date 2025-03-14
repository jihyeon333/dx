<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import Form from '@/components/common/Form.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import { useValidation } from '@/validation/useValidation';

const props = defineProps({
    isAdmin: Boolean // 일반 로그인 or 관리자 로그인 여부
});

const emits = defineEmits(['updateError', 'loginSuccess']);
const router = useRouter();

const fields = {
    userId: ref(''),
    userPassword: ref('')
};

const { errorMessage, validateField, validateForm } = useValidation(fields);

const disableLogin = computed(() => {
    return !fields.userId.value.trim() ||
        !fields.userPassword.value.trim() ||
        !!errorMessage.value.userId ||
        !!errorMessage.value.userPassword;
});

const submitLogin = () => {
    if (!validateForm()) return;

    const mockUsers = [
        { userId: 'admin', password: 'Admin@12345', role: 'admin' },
        { userId: 'user', password: 'pass@12345', role: 'user' }
    ];

    const user = mockUsers.find(u => u.userId === fields.userId.value && u.password === fields.userPassword.value);

    if (user) {
        localStorage.setItem("userToken", "mock-token");
        localStorage.setItem("user", JSON.stringify({ role: user.role }));

        emits('updateError', { error: false, message: '' });
        emits('loginSuccess', { userType: user.role });

        // ✅ 로그인 성공 정보를 query로 전달
        if (user.role === 'admin') {
            router.push({ path: '/admin/adminmypage', query: { success: true } });
        } else {
            router.push({ path: '/user', query: { success: true } });
        }
    } else {
        emits('updateError', { error: true, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
};


</script>

<template>
    <Form title="로그인" @submit.prevent="submitLogin" buttonPosition="inside" class="login-form">
        <div class="input-wrapper">
            <div class="input-wrap">
                <span class="label">아이디</span>
                <Input v-model="fields.userId.value" placeholder="아이디를 입력해주세요" :errorMessage="errorMessage.userId"
                    @blur="validateField('userId', fields.userId.value)"
                    @input="validateField('userId', fields.userId.value)" />
            </div>
            <div class="input-wrap">
                <span class="label">비밀번호</span>
                <Input v-model="fields.userPassword.value" placeholder="비밀번호를 입력해주세요" type="password"
                    :errorMessage="errorMessage.userPassword"
                    @blur="validateField('userPassword', fields.userPassword.value)"
                    @input="validateField('userPassword', fields.userPassword.value)" />
            </div>
        </div>

        <template #buttons>
            <div class="button-wrap">
                <div class="button">
                    <Button :label="props.isAdmin ? '관리자 로그인' : '로그인'" type="primary" :disabled="disableLogin"
                        class="login-btn" @click="submitLogin" />
                </div>
                <div class="buttons">
                    <router-link :to="{ path: '/auth/signup' }" replace class="find-btn">회원가입</router-link>
                    <router-link :to="{ path: '/auth/find-id' }" replace class="find-btn">아이디찾기</router-link>
                    <router-link :to="{ path: '/auth/find-password' }" replace class="find-btn">비밀번호찾기</router-link>
                </div>
            </div>
        </template>
    </Form>
</template>