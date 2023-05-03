const actions = {
  async onAuthStateChangedAction(state, { authUser }) {
    if (!authUser) {
      // remove state
      state.commit('SET_USER', null);

      // redirect from here
      this.$router.push({
        path: '/Login'
      });
    } else {
      const { uid, email, Aa } = authUser;

      //localStorage.setItem('token', Aa);
      state.commit('Set_token', Aa);

      state.commit('SET_USER', {
        uid,
        email,
        Aa
      });
      this.$router.go(-2);
    }
  },
  settoken({ commit }, data) {
    commit('Set_token', data);
  }
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  Set_token(state, data) {
    state.token = data;
  }
};

const state = () => ({
  user: null,
  token: ''
});

const getters = {
  getUser(state) {
    return state.user, state.token;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
