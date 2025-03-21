import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

//  Lazy Loading 적용
const login = () => import("@/views/Login/LoginView.vue");
const signUp = () => import("@/views/Login/SignUpView.vue");
const findId = () => import("@/views/Login/FindIdView.vue");
const findPw = () => import("@/views/Login/FindPasswordView.vue");
const process = () => import("@/views/User/Process/ProcessView.vue");
const data = () => import("@/views/User/Data/DataView.vue");
const device = () => import("@/views/User/Device/DeviceView.vue");
const dtLink = () => import("@/views/User/DTlink/DTlinkView.vue");
const solution = () => import("@/views/User/Solution/SolutionView.vue");

//  솔루션 내부 페이지 Lazy Loading 적용
const solutionMain = () => import("@/views/User/Solution/SolutionMainView.vue");
const solutionAdd = () => import("@/views/User/Solution/SolutionAddView.vue");
const solutionEdit = () => import("@/views/User/Solution/SolutionEditView.vue");
const solutionParams = () => import("@/views/User/Solution/SolutionParamsView.vue");

// DT연계관리
const dtLinkMain = () => import("@/views/User/DTlink/DTlinkMainView.vue");
const dtLinkAdd = () => import("@/views/User/DTlink/DTlinkAddView.vue");
const dtLinkEdit = () => import("@/views/User/DTlink/DTlinkEditView.vue");
const dtLinkParams = () => import("@/views/User/DTlink/DTlinkParamsView.vue");

// 마이페이지 관련 뷰
const userMypage = () => import("@/views/User/Mypage/UserMypageView.vue");
const adminMypage = () => import("@/views/Admin/Mypage/AdminMypageView.vue");

// 관리자마이페이지
const usersList = () => import("@/views/Admin/Mypage/UsersLIstView.vue");
const usersApproval = () => import("@/views/Admin/Mypage/UsersApprovalView.vue");
const usersUsage = () => import("@/views/Admin/Mypage/UsersUsageView.vue");

const NotFound = () => import("@/views/Error/ForbiddenView.vue");

const routes = [
	//  기본 경로에서 로그인 페이지로 리디렉트
	{
		path: "/",
		redirect: "/auth/login",
	},

	//  로그인 관련 페이지 (DefaultLayout 적용)
	{
		path: "/auth",
		component: DefaultLayout,
		children: [
			{ path: "logIn", name: "Login", component: login },
			{ path: "signUp", name: "SignUp", component: signUp },
			{ path: "findId", name: "FindId", component: findId },
			{ path: "findPassword", name: "FindPassword", component: findPw },
		],
	},

	//  일반 사용자 페이지 (UserLayout 적용)
	{
		path: "/user",
		component: UserLayout,
		meta: [{ requiresAuth: true }],
		children: [
			{ path: "process", name: "Process", component: process },
			{ path: "data", name: "Data", component: data },
			{ path: "device", name: "Device", component: device },
			{
				path: "dtLink",
				component: dtLink, // DT연계관리
				children: [
					{ path: "", name: "dtLinkMain", component: dtLinkMain }, // 기본 페이지
					{ path: "add", name: "dtLinkAdd", component: dtLinkAdd },
					{ path: "edit", name: "dtLinkEdit", component: dtLinkEdit, props: true },
					{ path: "params", name: "dtLinkParams", component: dtLinkParams },
				],
			},
			{
				path: "solution",
				component: solution, // 솔루션 메인 레이아웃
				children: [
					{ path: "", name: "SolutionMain", component: solutionMain }, // 기본 페이지
					{ path: "add", name: "SolutionAdd", component: solutionAdd },
					{ path: "edit", name: "SolutionEdit", component: solutionEdit, props: true },
					{ path: "params", name: "SolutionParams", component: solutionParams },
				],
			},
			// 일반 사용자 마이페이지 추가
			{ path: "mypage", name: "UserMypage", component: userMypage, meta: { requiresAuth: true } },
		],
	},

	// 관리자 페이지 (AdminLayout 적용)
	{
		path: "/admin",
		component: AdminLayout,
		meta: { requiresAuth: true, adminOnly: true },
		children: [
			{
				path: "mypage",
				component: adminMypage, // 관리자 마이페이지 메인
				children: [
					{ path: "", redirect: "/admin/mypage/userlist" }, // 기본 마이페이지
					{ path: "userlist", name: "usersList", component: usersList }, // 회원관리
					{ path: "approval", name: "usersApproval", component: usersApproval }, // 사용자 승인관리
					{ path: "usage", name: "usersUsage", component: usersUsage }, // 사용정보
				],
			},
		],
	},

	// 마이페이지 리디렉트 (관리자 & 사용자 구분)
	{
		path: "/mypage",
		redirect: () => {
			const user = JSON.parse(localStorage.getItem("user") ?? "{}");
			return user.role === "admin" ? "/admin/mypage" : "/user/mypage";
		},
	},

	//  404 페이지
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

// 네비게이션 가드 (라우트 보호)
router.beforeEach((to, from, next) => {
	const userToken = localStorage.getItem("userToken");
	const isAuthenticated = !!userToken;
	const user = JSON.parse(localStorage.getItem("user") ?? "{}");
	const isAdmin = user.role === "admin";

	// 로그인 여부 확인
	if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: "Login" });
	}
	// 관리자 전용 페이지 차단
	else if (to.meta.adminOnly && !isAdmin) {
		next({ name: "Process" });
	}
	// 마이페이지 접근 시, 사용자 유형에 맞는 페이지로 이동
	else if (to.name === "mypage") {
		next(isAdmin ? "/admin/mypage/userlist" : "/user/mypage/profile");
	} else {
		next();
	}
});

export default router;
