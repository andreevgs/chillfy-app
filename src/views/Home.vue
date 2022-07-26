<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
    <div v-if="!isLoggedIn">
      <h3>You need to sign up or sign in to use this app.</h3>
      <RouterLink to="/register" style="margin-right: 16px">
        <button class="btn btn-primary btn-block">
          <span>Sign up</span>
        </button>
      </RouterLink>
      <RouterLink to="/login">
        <button class="btn btn-primary btn-block">
          <span>Sign in</span>
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home",
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  data() {
    return {
      content: "Home Page",
    };
  },
};
</script>
