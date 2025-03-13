import { createStore } from 'vuex';

export const store = createStore({
  state: {
    user: {
      isLoggedIn: false,  // 로그인 여부
      role: 'user',       // 'user' 또는 'admin'
    },
  },
  mutations: {
    setLoginStatus(state, status) {
      state.user.isLoggedIn = status;
    },
    setUserRole(state, role) {
      state.user.role = role;
    },
  },
});
