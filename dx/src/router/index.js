import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";

// ✅ Lazy Loading 적용
const login = () => import("@/views/Login/LoginView.vue");
const signUp = () => import("@/views/Login/SignUpView.vue");
const findId = () => import("@/views/Login/FindIdView.vue");
const findPw = () => import("@/views/Login/FindPasswordView.vue");
const process = () => import("@/views/User/Process/ProcessView.vue");
const data = () => import("@/views/User/Data/DataView.vue");
const device = () => import("@/views/User/Device/DeviceView.vue");
const dtLink = () => import("@/views/User/DTlink/DTlinkView.vue");
const solution = () => import("@/views/User/Solution/SolutionView.vue");

// ✅ 솔루션 내부 페이지 Lazy Loading 적용
const solutionMain = () => import("@/views/User/Solution/SolutionMainView.vue");
const solutionAdd = () => import("@/views/User/Solution/SolutionAddView.vue");
const solutionEdit = () => import("@/views/User/Solution/SolutionEditView.vue");
const solutionParams = () => import("@/views/User/Solution/SolutionParamsView.vue");

const adminDashboard = () => import("@/views/Admin/Dashboard/AdminDashboardView.vue");
const NotFound = () => import("@/views/Error/ForbiddenView.vue");

const routes = [
	// ✅ 기본 경로에서 로그인 페이지로 리디렉트
	{
		path: "/",
		redirect: "/auth/login",
	},

	// ✅ 로그인 관련 페이지 (DefaultLayout 적용)
	{
		path: "/auth",
		component: DefaultLayout,
		children: [
			{ path: "login", name: "Login", component: login },
			{ path: "signup", name: "SignUp", component: signUp },
			{ path: "findId", name: "FindId", component: findId },
			{ path: "findPassword", name: "FindPassword", component: findPw },
		],
	},

	// ✅ 일반 사용자 페이지 (UserLayout 적용)
	{
		path: "/user",
		component: UserLayout,
		meta: [{ requiresAuth: true }],
		children: [
			{ path: "process", name: "Process", component: process },
			{ path: "data", name: "Data", component: data },
			{ path: "device", name: "Device", component: device },
			{ path: "dtLink", name: "DTlink", component: dtLink },
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
		],
	},

	// ✅ 관리자 페이지 (DefaultLayout 적용)
	{
		path: "/admin",
		component: DefaultLayout,
		meta: { requiresAuth: true, adminOnly: true },
		children: [{ path: "dashboard", name: "AdminDashboard", component: adminDashboard }],
	},

	// ✅ 404 페이지
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

// ✅ 네비게이션 가드 (라우트 보호)
router.beforeEach((to, from, next) => {
	const userToken = localStorage.getItem("userToken");
	const isAuthenticated = !!userToken;
	const user = JSON.parse(localStorage.getItem("user") ?? "{}");
	const isAdmin = user.role === "admin";

	if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: "Login" });
	} else if (to.meta.adminOnly && !isAdmin) {
		next({ name: "Process" });
	} else {
		next();
	}
});

export default router;
