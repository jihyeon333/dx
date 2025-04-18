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

// 공정관리 내부 페이지
const processMain = () => import("@/views/User/Process/ProcessMainView.vue");
const processAdd = () => import("@/views/User/Process/ProcessAddView.vue");
const processEdit = () => import("@/views/User/Process/ProcessEditView.vue");

// 데이터관리 내부페이지
const dataMain = () => import("@/views/User/Data/DataMainView.vue");
const dataDeviceList = () => import("@/views/User/Data/DeviceListView.vue");
const dataDeviceView = () => import("@/views/User/Data/DeviceDataView.vue");
const dataGraph = () => import("@/views/User/Data/GraphMainView.vue");
const dataCCTV = () => import("@/views/User/Data/CCTVMainView.vue");

// 장비관리내부페이지
const deviceMain = () => import("@/views/User/Device/DeviceMainView.vue");
const deviceAdd = () => import("@/views/User/Device/DeviceAddView.vue");
const deviceEdit = () => import("@/views/User/Device/DeviceEditView.vue");
const deviceFormat = () => import("@/views/User/Device/DeviceFormat.vue");

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

// 일반회원마이페이지
const userMyProfile = () => import("@/views/User/Mypage/MyProfileView.vue");
const userMyUsage = () => import("@/views/User/Mypage/MyUsageView.vue");

// 관리자마이페이지
const adminUsersList = () => import("@/views/Admin/Mypage/UsersListView.vue");
const adminUsersApproval = () => import("@/views/Admin/Mypage/UsersApprovalView.vue");
const adminUsersUsage = () => import("@/views/Admin/Mypage/UsersUsageView.vue");

// 사용자마이페이지

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
		meta: { requiresAuth: true },
		children: [
			{
				path: "process",
				component: process, // 공정관리 메인 레이아웃
				children: [
					{ path: "", name: "ProcessMain", component: processMain }, // 기본 페이지
					{ path: "add", name: "ProcessAdd", component: processAdd },
					{ path: "edit", name: "ProcessEdit", component: processEdit, props: true },
				],
			},
			// 데이터관리
			{
				path: "data",
				component: data,
				children: [
					{ path: "", name: "dataMain", component: dataMain },
					{
						path: "list",
						children: [
							{
								path: ":processId",
								name: "dataDeviceList",
								component: dataDeviceList,
								props: (route) => ({
									processId: route.params.processId,
									processName: route.query.processName,
								}),
								beforeEnter: (to, from, next) => {
									const { processId } = to.params;
									if (!processId || processId === "undefined") next({ name: "dataMain" });
									else next();
								},
							},
							{
								path: ":processId/view",
								name: "dataDeviceView",
								component: dataDeviceView,
								props: (route) => ({
									processId: route.params.processId,
									processName: route.query.processName,
								}),
								beforeEnter: (to, from, next) => {
									const { processId } = to.params;
									if (!processId || processId === "undefined") next({ name: "dataMain" });
									else next();
								},
							},
							{
								path: ":processId/graph/:deviceId",
								name: "dataGraph",
								component: dataGraph,
								props: true,
								beforeEnter: (to, from, next) => {
									const { processId, deviceId } = to.params;
									if (!processId || !deviceId || processId === "undefined" || deviceId === "undefined") next({ name: "dataMain" });
									else next();
								},
							},
							{
								path: ":processId/cctv/:deviceId",
								name: "dataCCTV",
								component: dataCCTV,
								props: true,
								beforeEnter: (to, from, next) => {
									const { processId, deviceId } = to.params;
									if (!processId || !deviceId || processId === "undefined" || deviceId === "undefined") next({ name: "dataMain" });
									else next();
								},
							},
						],
					},
				],
			},
			{
				path: "device",
				component: device, // 장비관리 메인 레이아웃
				children: [
					{ path: "", name: "deviceMain", component: deviceMain }, // 기본 페이지
					{ path: "add", name: "deviceAdd", component: deviceAdd },
					{ path: "edit", name: "deviceEdit", component: deviceEdit, props: true },
					{ path: "format", name: "deviceFormat", component: deviceFormat },
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

			// 일반 사용자 마이페이지 추가
			{
				path: "mypage",
				meta: { requiresAuth: true },
				component: userMypage,
				children: [
					{ path: "", redirect: "/user/mypage/profile" }, // 기본 마이페이지
					{ path: "profile", name: "userMyProfile", component: userMyProfile }, //내 프로필
					{ path: "myusage", name: "userMyUsage", component: userMyUsage }, // 내 사용정보
				],
			},
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
					{ path: "userlist", name: "usersList", component: adminUsersList }, // 회원관리
					{ path: "userapproval", name: "usersApproval", component: adminUsersApproval }, // 사용자 승인관리
					{ path: "userusage", name: "usersUsage", component: adminUsersUsage }, // 사용정보
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
