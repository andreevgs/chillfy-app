<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        v-if="!confirmationRequired"
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
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
      <Form v-if="!confirmationRequired" @submit="handleRegister" :validation-schema="userSchema">
        <div>
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="firstName">First name</label>
            <Field name="firstName" type="text" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="lastName">Last name</label>
            <Field name="lastName" type="text" class="form-control" />
            <ErrorMessage name="lastName" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone number</label>
            <Field name="phoneNumber" type="text" class="form-control" />
            <ErrorMessage name="phoneNumber" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="email" class="form-control" />
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
              Sign Up
            </button>
          </div>
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
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const confirmationSchema = yup.object().shape({
      code: yup
          .string()
          .required("Please enter confirmation code"),
    });
    const userSchema = yup.object().shape({
      username: yup
        .string()
        .required("Username is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
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
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.loading = true;

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.confirmationRequired = true;
          this.userEmail = user.email;
          this.userPassword = user.password;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.loading = false;
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
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
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
