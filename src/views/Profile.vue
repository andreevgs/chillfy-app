<template>
  <div class="container">
    <header class="jumbotron">
      <h2>Your profile</h2>
      <h3>
        <strong>{{user?.username}}</strong>
      </h3>
    </header>
    <p>
      <strong>Id:</strong>
      {{user?.id}}
    </p>
    <p>
      <strong>Email:</strong>
      {{user?.email}}
    </p>
    <p>
      <strong>Role:</strong>
      {{user?.role?.nameEn}}
    </p>
  </div>
</template>

<script>
import UsersService from "../services/users.service";

export default {
  name: 'Profile',
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    UsersService.getCurrent().then(
        (response) => {
          this.user = response.data.user;
        },
        (error) => {
          this.content =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
              error.message ||
              error.toString();
        }
    );
  }
};
</script>