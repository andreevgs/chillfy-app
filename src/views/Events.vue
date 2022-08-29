<template>
  <div class="container">
    <div v-if="isCreationOfEventActive">
      <div class="col-md-12">
        <div class="card card-container">
          <Form @submit="handleCreation" :validation-schema="eventSchema">
            <div class="form-group">
              <label for="name">Name of event</label>
              <Field name="name" type="text" class="form-control" />
              <ErrorMessage name="name" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="description">description</label>
              <Field name="description" type="text" class="form-control" />
              <ErrorMessage name="description" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="date">description</label>
              <Field name="date" type="datetime-local" class="form-control" />
              <ErrorMessage name="date" class="error-feedback" />
            </div>

            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
                <span>Create event</span>
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
          <button class="btn btn-danger btn-block" v-on:click="isCreationOfEventActive = false">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="!isCreationOfEventActive">
      <h3>Events</h3>
      <button class="btn btn-primary btn-block" v-on:click="isCreationOfEventActive = true">Create Event</button>
      <ul class="list-group">
        <li class="list-group-item"
            v-for="(event, index) in events"
            :key="index"
        >
          <p>{{ event.name }}</p>
          <p>{{ getMoment(event.date) }}</p>
          <button class="btn btn-primary btn-block" v-on:click="this.$router.push(`/events/${event.id}`)">Change</button>
        </li>
      </ul>
      <h3>Invitations to you</h3>
      <ul class="list-group">
        <li class="list-group-item"
            v-for="(invitation, index) in invitations"
            :key="index"
        >
          <p>{{ invitation.event.name }}</p>
          <p>{{ getMoment(invitation.event.date) }}</p>
          <button class="btn btn-primary btn-block">Can not</button>
          <button class="btn btn-primary btn-block">Most Likely</button>
          <button class="btn btn-primary btn-block">Definitely Attend</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import * as yup from "yup";
import {ErrorMessage, Field, Form} from "vee-validate";
import EventsService from "../services/events.service";
export default {
  name: 'Events',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const eventSchema = yup.object().shape({
      name: yup.string().required("Name is required!"),
      description: yup.string(),
    });

    return {
      events: [],
      invitations: [],
      isCreationOfEventActive: false,
      loading: false,
      message: "",
      eventSchema
    };
  },
  mounted() {
    EventsService.getEvents().then(
        (response) => {
          this.events = response.data.events;
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
    EventsService.getInvitations().then(
        (response) => {
          this.invitations = response.data.invitations;
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
    getMoment(date) {
      return moment(date).calendar();
    },
    handleCreation(event) {
      this.loading = true;
      EventsService.createEvent(event).then(
          response => {
            this.events.push(response.data.event);
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      )
    },
  }
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

.btn {
  margin-right: 16px;
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
