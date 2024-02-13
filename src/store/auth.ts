// auth.ts

import axios from "axios";
import { Module } from "vuex";

interface IAuthState {
  accessToken?: string;
  user?: object;
}

const authStore: Module<IAuthState, unknown> = {
  state: {
    accessToken: undefined,
    user: undefined,
  },
  mutations: {
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
      localStorage.setItem("token", accessToken);
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}oauth/token`,
          {
            Email: email,
            Password: password,
            GrantType: "password",
            Scope: "amazon_data",
            ClientId: "C0001",
            ClientSecret: "SECRET0001",
            RedirectUri: "https://api.eva.guru",
          }
        );

        const accessToken = response.data.Data.AccessToken;
        commit("setAccessToken", accessToken);

        const userInfoResponse = await axios.post(
          `${process.env.VUE_APP_BASE_URL}user/user-information`,
          {
            email: email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const user = userInfoResponse.data;
        commit("setUser", user);
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.accessToken !== null;
    },
    currentUser(state) {
      return state.user;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
  },
};

export default authStore;
