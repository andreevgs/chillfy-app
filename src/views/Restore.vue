<template>
  <div class="col-md-12">
    <div class="card card-container">
      <Form v-if="confirmationRequired && !isPasswordRestored" @submit="handleConfirmation" :validation-schema="getCodeSchema">
        <p>Type your email to get code for password restoring.</p>
        <div class="form-group">
          <label for="email">Email</label>
          <Field name="email" type="text" class="form-control"/>
          <ErrorMessage name="email" class="error-feedback"/>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
              ></span>
            Get code
          </button>
        </div>
      </Form>
      <Form v-if="!confirmationRequired && !isPasswordRestored" @submit="handleChangePassword" :validation-schema="changePasswordSchema">
        <p>Enter the code and new password</p>
        <div class="form-group">
          <label for="code">Code</label>
          <Field name="code" type="text" class="form-control"/>
          <ErrorMessage name="code" class="error-feedback"/>
        </div>
        <div class="form-group">
          <label for="newPassword">New password</label>
          <Field name="newPassword" type="password" class="form-control"/>
          <ErrorMessage name="newPassword" class="error-feedback"/>
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
            <span>Change Password</span>
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
      <button class="btn btn-primary btn-block" v-if="!confirmationRequired && !isPasswordRestored" v-on:click="confirmationRequired = true">Return to getting code</button>
      <div v-if="isPasswordRestored">
        <p>Password was successfully changed, you can login with new password</p>
        <button class="btn btn-primary btn-block" v-on:click="this.$router.push('/login')">Go to Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import {Form, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import AuthService from "../services/auth.service";

export default {
  name: "Restore",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const getCodeSchema = yup.object().shape({
      email: yup.string().required("Email is required!"),
    });

    const changePasswordSchema = yup.object().shape({
      newPassword: yup.string().required("New password is required!"),
      code: yup
          .string()
          .required("Please enter confirmation code"),
    });

    return {
      loading: false,
      message: "",
      isPasswordRestored: false,
      email: "",
      password: "",
      confirmationRequired: true,
      getCodeSchema,
      changePasswordSchema
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
    handleChangePassword(user) {
      this.loading = true;
      AuthService.changePassword({code: user.code, email: this.email, newPassword: user.newPassword}).then(
          () => {
            this.isPasswordRestored = true;
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

      AuthService.codeForRestore(confirmation.email).then(
          () => {
            this.email = confirmation.email;
            this.confirmationRequired = false;
            this.message = '';
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
