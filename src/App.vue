<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>
<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link">
            Home
          </RouterLink>
        </li>
      </div>

      <div v-if="!isLoggedIn" class="navbar-nav ml-auto">
        <li class="nav-item">
          <RouterLink to="/register" class="nav-link">
            Sign Up
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/login" class="nav-link">
            Sign In
          </RouterLink>
        </li>
      </div>

      <div v-if="isLoggedIn" class="navbar-nav ml-auto">
        <li class="nav-item">
          <RouterLink to="/profile" class="nav-link">
            Profile
          </RouterLink>
        </li>
<!--        <li class="nav-item">-->
<!--          <RouterLink to="/contacts" class="nav-link">-->
<!--            Contacts-->
<!--          </RouterLink>-->
<!--        </li>-->
        <li class="nav-item">
          <RouterLink to="/users" class="nav-link">
            Users
          </RouterLink>
        </li>
        <li class="nav-item">
          <a style="cursor: pointer" class="nav-link" @click.prevent="logOut">
            LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout").then(
          () => {
            this.$router.push("/login");
          },
      );
    }
  }
};
</script>

