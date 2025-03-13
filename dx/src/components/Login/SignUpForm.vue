<script setup>
import { ref, computed, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';
import Form from '@/components/common/Form.vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import DropdownMenu from '../common/DropdownMenu.vue';
import { useValidation } from '@/validation/useValidation';

const router = useRouter();
const emits = defineEmits(['updateError', 'showModal']);

const fields = {
    userId: ref(''),
    userPassword: ref(''),
    userPasswordConfirm: ref(''),
    userName: ref(''),
    userPhone: ref(''),
    userEmail: ref(''),
    companyName: ref(''),
    memberTypeSingle: ref('')
};

const placeholders = {
    userId: "아이디를 입력하하세요",
    userPassword: "비밀번호를 입력하하세요.",
    userPasswordConfirm: "비밀번호를 다시 한번 입력하하세요",
    userName: "이름을 입력하하세요",
    userPhone: "010-0000-0000",
    userEmail: "pomia@pomia.co.kr",
    companyName: "회사명을 입력하세요요",
    memberTypeSingle: "회원형태를 선택하세요"
};

const { errorMessage, validateField } = useValidation(fields);

const resetForm = () => {
    Object.keys(fields).forEach(key => {
        fields[key].value = '';
    });
    isIdChecked.value = false;
    isCheckDisabled.value = false;
};

const fetchUserIdAvailability = async (id) => {
    const existingUsers = ["admin", "testuser", "example123"];
    return !existingUsers.includes(id);
};

const handleCancel = () => {
    resetForm();
    router.push({ name: "Login" }); // ✅ 네임드 라우트 사용
};


const isIdChecked = ref(false);
const isCheckDisabled = ref(false);
const memberTypeOptions = ['실증솔루션', '디지털 트윈', '관리자'];

watch(fields.memberTypeSingle, (newValue) => validateField('memberTypeSingle', newValue));
watch(fields.userPhone, (newValue) => {
    let cleaned = newValue.replace(/\D/g, ''); // 숫자만 남기기

    if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11); // 11자리 초과 입력 방지
        errorMessage.value.userPhone = '전화번호는 최대 11자리까지만 입력 가능합니다.';
    } else {
        errorMessage.value.userPhone = '';
    }

    if (cleaned.length >= 8) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3, cleaned.length - 4)}-${cleaned.slice(cleaned.length - 4)}`;
    } else if (cleaned.length >= 4) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }

    fields.userPhone.value = cleaned; // 변환된 값 적용
    validateField('userPhone', fields.userPhone.value); // 값이 변경될 때마다 검증 실행
});



Object.keys(fields).forEach(field => {
    watch(fields[field], (newValue) => {
        if (field !== 'userId') validateField(field, newValue);
    });
});

const checkUserId = async () => {
    validateField('userId', fields.userId.value);

    if (errorMessage.value.userId) return;

    const isAvailable = await fetchUserIdAvailability(fields.userId.value.trim());

    emits("showModal", {
        title: "아이디 중복 확인",
        message: isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.",
        type: isAvailable ? "success" : "error",
        onConfirm: () => {
            if (isAvailable) {
                isCheckDisabled.value = true;
                isIdChecked.value = true;
                errorMessage.value.userId = "";
            }
        }
    });
};

const disableRegister = computed(() => {
    return Object.values(errorMessage.value).some(msg => msg) ||
        Object.values(fields).some(field => !field.value.trim()) ||
        !isIdChecked.value;
});

const submitSignUp = () => {
    validateField('memberTypeSingle', fields.memberTypeSingle.value);

    if (!isIdChecked.value) {
        errorMessage.value.userId = "아이디 중복 확인을 완료해주세요.";
        return;
    }

    if (disableRegister.value) {
        return;
    }

    emits("showModal", {
        title: "회원가입 완료",
        message: "회원가입이 완료되었습니다!",
        type: "success",
        onConfirm: () => {
            router.push({ name: "Login" });
        }
    });
};
</script>

<template>
    <Form title="회원가입" @submit.prevent="submitSignUp" class="sign-form" buttonPosition="inside">
        <div class="input-wrap">
            <div class="input-item">
                <p class="tit">아이디</p>
                <Input v-model="fields.userId.value" placeholder="아이디를 입력해주세요"
                    v-model:errorMessage="errorMessage.userId" showCheckButton checkButtonLabel="중복확인"
                    :isCheckDisabled="isCheckDisabled" @checkValue="checkUserId" />
            </div>
            <template v-for="(field, key) in fields" :key="key">
                <div class="input-item" v-if="key !== 'userId'">
                    <p class="tit">
                        {{ key === 'memberTypeSingle' ? '회원형태' :
                            key === 'userPassword' ? '비밀번호' :
                                key === 'userPasswordConfirm' ? '비밀번호 확인' :
                                    key === 'userName' ? '회원명' :
                                        key === 'userPhone' ? '전화번호' :
                                            key === 'userEmail' ? '이메일' :
                                                key === 'companyName' ? '회사명' : '' }}
                    </p>
                    <Input v-if="key !== 'memberTypeSingle'" :type="key.includes('Password') ? 'password' : 'text'"
                        showEyeIcon v-model="fields[key].value" :placeholder="placeholders[key]"
                        v-model:errorMessage="errorMessage[key]" @keyup.enter="validateField(key, fields[key].value)" />
                    <DropdownMenu v-else v-model="fields.memberTypeSingle.value" :options="memberTypeOptions"
                        placeholder="회원형태를 선택해주세요." type="radio" @validateField="validateField" />
                </div>
            </template>
        </div>

        <template #buttons>
            <div class="buttons">
                <div class="button">
                    <Button label="취소" type="button" @click="handleCancel" class="cancle-btn" />
                </div>
                <div class="button">
                    <Button label="등록신청" type="submit" :disabled="disableRegister" class="sign-btn" />
                </div>
            </div>
        </template>
    </Form>
</template>
