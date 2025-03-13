import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";

// ✅ Lazy Loading 적용
const Login = () => import("@/views/Login/LoginView.vue");
const SignUp = () => import("@/views/Login/SignUpView.vue");
const FindId = () => import("@/views/Login/FindIdView.vue");
const FindPw = () => import("@/views/Login/FindPasswordView.vue");
const Process = () => import("@/views/User/Process/ProcessView.vue");
const Data = () => import("@/views/User/Data/DataView.vue");
const Device = () => import("@/views/User/Device/DeviceView.vue");
const DTlink = () => import("@/views/User/DTlink/DTlinkView.vue");
const Solution = () => import("@/views/User/Solution/SolutionView.vue");

// ✅ 솔루션 내부 페이지 Lazy Loading 적용
const SolutionMain = () => import("@/views/User/Solution/SolutionMainView.vue");
const SolutionAdd = () => import("@/views/User/Solution/SolutionAddView.vue");
const SolutionEdit = () => import("@/views/User/Solution/SolutionEditView.vue");
const SolutionParams = () => import("@/views/User/Solution/SolutionParamsView.vue");

const AdminDashboard = () => import("@/views/Admin/Dashboard/AdminDashboardView.vue");
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
			{ path: "login", name: "Login", component: Login },
			{ path: "signup", name: "SignUp", component: SignUp },
			{ path: "find-id", name: "FindId", component: FindId },
			{ path: "find-password", name: "FindPassword", component: FindPw },
		],
	},

	// ✅ 일반 사용자 페이지 (UserLayout 적용)
	{
		path: "/user",
		component: UserLayout,
		meta: [{ requiresAuth: true }],
		children: [
			{ path: "process", name: "Process", component: Process },
			{ path: "data", name: "Data", component: Data },
			{ path: "device", name: "Device", component: Device },
			{ path: "dtlink", name: "DTlink", component: DTlink },
			{
				path: "solution",
				component: Solution, // 솔루션 메인 레이아웃
				children: [
					{ path: "", name: "SolutionMain", component: SolutionMain }, // 기본 페이지
					{ path: "add", name: "SolutionAdd", component: SolutionAdd },
					{ path: "edit", name: "SolutionEdit", component: SolutionEdit, props: true },
					{ path: "params", name: "SolutionParams", component: SolutionParams },
				],
			},
		],
	},

	// ✅ 관리자 페이지 (DefaultLayout 적용)
	{
		path: "/admin",
		component: DefaultLayout,
		meta: { requiresAuth: true, adminOnly: true },
		children: [{ path: "dashboard", name: "AdminDashboard", component: AdminDashboard }],
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
