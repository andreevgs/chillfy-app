<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
        v-if="!confirmationRequired"
      />
      <Form v-if="confirmationRequired" @submit="handleConfirmation" :validation-schema="confirmationSchema">
        <p>Confirmation code was sent to your Email.</p>
        <p>Check your Email and input code to verify yourself.</p>
        <div class="form-group">
          <label for="code">Code</label>
          <Field name="code" type="text" class="form-control" />
          <ErrorMessage name="code" class="error-feedback" />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
              ></span>
            Send
          </button>
        </div>
      </Form>
      <Form v-if="!confirmationRequired" @submit="handleLogin" :validation-schema="userSchema">
        <div class="form-group">
          <label for="email">Email</label>
          <Field name="email" type="text" class="form-control" />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Field name="password" type="password" class="form-control" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
        </div>
      </Form>
      <div
          v-if="message"
          class="alert"
          :class="'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "../services/auth.service";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const userSchema = yup.object().shape({
      email: yup.string().required("Email is required!"),
      password: yup.string().required("Password is required!"),
    });

    const confirmationSchema = yup.object().shape({
      code: yup
          .string()
          .required("Please enter confirmation code"),
    });

    return {
      loading: false,
      message: "",
      userEmail: "",
      userPassword: "",
      confirmationRequired: false,
      userSchema,
      confirmationSchema
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/profile");
        },
        (error) => {
          if(error.response.status === 403 && error.response.data.isConfirmed === false){
            AuthService.code(user).then(
                () => {
                  this.userEmail = user.email;
                  this.userPassword = user.password;
                  this.confirmationRequired = true;
                  this.message = '';
                  this.loading = false;
                },
                () => {
                  this.message =
                      (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                      error.message ||
                      error.toString();
                  this.loading = false;
                }
            )
          }
          else {
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
        }
      );
    },
    handleConfirmation(confirmation) {
      this.message = "";
      this.loading = true;

      AuthService.confirm({
        email: this.userEmail,
        password: this.userPassword,
        code: parseInt(confirmation.code),
      }).then(
          (response) => {
            this.$store.dispatch("auth/login", {
              email: this.userEmail,
              password: this.userPassword
            }).then(
                () => {
                  this.$router.push("/profile");
                },
                (error) => {
                  this.loading = false;
                  this.message =
                      (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                      error.message ||
                      error.toString();
                }
            );
          },
          (error) => {
            console.log(error.response.data.message);
            this.message = error.response.data.message;
            console.log(this.message);
            this.loading = false;
          }
      );
    }
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
