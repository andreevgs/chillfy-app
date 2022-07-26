<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        Users
      </h3>
    </header>
    <ul class="list-group">
      <li class="list-group-item"
          v-for="(user, index) in users"
          :key="index"
      >
        <p>{{ user.firstName }} {{ user.lastName }}</p>
        <p>{{user.username}}</p>
        <p>{{user.email}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import UsersService from "../services/users.service";

export default {
  name: 'Users',
  data() {
    return {
      users: []
    };
  },
  mounted() {
    UsersService.getAll().then(
        (response) => {
          this.users = response.data.users;
          console.log(response.data);
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