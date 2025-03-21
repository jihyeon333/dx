import { ref } from "vue";

// 정규식 정의
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+$/;
const phoneRegex = /^010-\d{3,4}-\d{4}$/;
const koreanRegex = /^[가-힣]+$/;

// 필수 입력값 확인 함수
const isEmpty = (value) => !value.trim();

// 유효성 검사 규칙 정의
const validationRules = {
	userId: (value) => (isEmpty(value) ? "아이디를 입력해주세요." : ""),
	userPassword: (value) => (isEmpty(value) ? "비밀번호를 입력해주세요." : !passwordRegex.test(value) ? "비밀번호는 10자 이상, 영문/숫자/특수문자를 포함해야 합니다." : ""),
	userPasswordConfirm: (value, fields) => (isEmpty(value) ? "비밀번호 확인을 입력해주세요." : value !== fields.userPassword.value ? "비밀번호가 일치하지 않습니다." : ""),
	userName: (value) => (isEmpty(value) ? "이름을 입력해주세요." : !koreanRegex.test(value) ? "이름은 한글만 입력 가능합니다." : ""),
	userPhone: (value) => (isEmpty(value) ? "전화번호를 입력해주세요." : !phoneRegex.test(value) ? "올바른 전화번호 형식을 입력해주세요. (010-0000-0000)" : ""),
	userEmail: (value) => (isEmpty(value) ? "이메일을 입력해주세요." : !emailRegex.test(value) ? "올바른 이메일 형식을 입력해주세요." : ""),
	companyName: (value) => (isEmpty(value) ? "회사명을 입력해주세요." : ""),
	memberTypeSingle: (value) => (!value ? "회원형태를 선택해주세요." : ""),
};

export function useValidation(fields) {
	const errorMessage = ref({});

	// 개별 필드 유효성 검사
	const validateField = (field, value) => {
		if (validationRules[field]) {
			errorMessage.value[field] = ""; // 기존 메시지 초기화
			errorMessage.value[field] = validationRules[field](value, fields);
		}
	};

	// 전체 폼 유효성 검사
	const validateForm = () => {
		let isValid = true;
		Object.keys(fields).forEach((field) => {
			validateField(field, fields[field].value);
			if (errorMessage.value[field]) {
				isValid = false;
			}
		});
		return isValid;
	};

	return {
		errorMessage,
		validateField,
		validateForm,
	};
}
