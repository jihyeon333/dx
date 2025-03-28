import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    start() {
      this.isLoading = true;
    },
    end() {
      this.isLoading = false;
    },
  },
});