import AuthService from '../services/auth.service';
console.log(localStorage.getItem('accessToken'));
const accessToken = JSON.parse(localStorage.getItem('accessToken'));
const initialState = accessToken
  ? { status: { loggedIn: true } }
  : { status: { loggedIn: false } };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        tokens => {
          commit('loginSuccess');
          return Promise.resolve();
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      return AuthService.logout().then(
          () => {
            commit('logoutSuccess')
            return Promise.resolve();
          },
          error => {
            commit('logoutFailure');
            return Promise.reject(error);
          }
      );
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
    },
    logoutSuccess(state) {
      state.status.loggedIn = false;
    },
    logoutFailure(state) {
      state.status.loggedIn = true;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
