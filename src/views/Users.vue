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
        <p>{{ user.username }}</p>
        <p>{{ user.email }}</p>
        <button v-if="!user.contactRequestFirstUser && !user.contactRequestSecondUser"
                class="btn btn-primary btn-block" v-on:click="createContactRequest(user)" :disabled="user.loading">
          <span
              v-show="user.loading"
              class="spinner-border spinner-border-sm"
          ></span>
          Add to contacts
        </button>
        <button
            v-if="!user.contactRequestFirstUser && user.contactRequestSecondUser && user.contactRequestSecondUser[0]?.status === null"
            class="btn btn-danger btn-block" v-on:click="deleteContactRequest(user)" :disabled="user.loading">
          <span
              v-show="user.loading"
              class="spinner-border spinner-border-sm"
          ></span>
          Delete request
        </button>
        <button
            v-if="(!user.contactRequestFirstUser && user.contactRequestSecondUser && user.contactRequestSecondUser[0]?.status === true) || (!user.contactRequestSecondUser && user.contactRequestFirstUser && user.contactRequestFirstUser[0]?.status === true)"
            class="btn btn-warning btn-block" v-on:click="deleteFromContacts(user)" :disabled="user.loading">
          <span
              v-show="user.loading"
              class="spinner-border spinner-border-sm"
          ></span>
          Delete from contacts
        </button>
        <button
            v-if="user.contactRequestFirstUser && user.contactRequestFirstUser[0]?.status === null && !user.contactRequestSecondUser"
            class="btn btn-primary btn-block"
            v-on:click="approveRequest(user)" :disabled="user.loading">
          <span
              v-show="user.loading"
              class="spinner-border spinner-border-sm"
          ></span>
          Approve request
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import UsersService from "../services/users.service";
import AccountService from "../services/account.service";

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
  },
  methods: {
    approveRequest(user) {
      user.loading = true;
      AccountService.changeContactRequest(user.contactRequestFirstUser[0].id, true).then(
          (response) => {
            this.users[this.users.indexOf(user)].contactRequestFirstUser[0].status = true;
            this.users[this.users.indexOf(user)].loading = false;
          },
          (error) => {
            console.log('error approving request');
            this.users[this.users.indexOf(user)].loading = false;
          }
      )
    },
    createContactRequest(user) {
      user.loading = true;
      AccountService.createContactRequest(user.id).then(
          (response) => {
            this.users[this.users.indexOf(user)].contactRequestSecondUser = [{
              id: response.data.request.id,
              status: null
            }];
            this.users[this.users.indexOf(user)].loading = false;
          },
          (error) => {
            console.log('error approving request');
            this.users[this.users.indexOf(user)].loading = false;
          }
      )
    },
    deleteContactRequest(user) {
      user.loading = true;
      AccountService.deleteContactRequest(user.contactRequestSecondUser[0].id).then(
          (response) => {
            this.users[this.users.indexOf(user)].contactRequestSecondUser = null;
            this.users[this.users.indexOf(user)].loading = false;
          },
          (error) => {
            console.log('error deleting request');
            this.users[this.users.indexOf(user)].loading = false;
          }
      )
    },
    deleteFromContacts(user) {
      user.loading = true;
      console.log(user.contactRequestFirstUser, user.contactRequestSecondUser)
      const isContactRequestFirstUser = !!user.contactRequestFirstUser;
      const isContactRequestSecondUser = !!user.contactRequestSecondUser;
      let contactRequestId;
      if(isContactRequestFirstUser && user.contactRequestFirstUser) {
        contactRequestId = user.contactRequestFirstUser[0].id;
      }
      else if (isContactRequestSecondUser && user.contactRequestSecondUser){
        contactRequestId = user.contactRequestSecondUser[0].id;
      }

      AccountService.deleteFromContacts(contactRequestId).then(
          (response) => {
            if(isContactRequestFirstUser) this.users[this.users.indexOf(user)].contactRequestFirstUser = null;
            if(isContactRequestSecondUser) this.users[this.users.indexOf(user)].contactRequestSecondUser = null;
            this.users[this.users.indexOf(user)].loading = false;
          },
          (error) => {
            console.log('error deleting request');
            this.users[this.users.indexOf(user)].loading = false;
          }
      )
    }
  }
};
</script>