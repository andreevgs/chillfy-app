<template>
  <div class="col-md-12">
    <div class="card card-container">
      <Form @submit="handleCreation" :validation-schema="eventSchema">
        <div class="form-group">
          <label for="name">Name of event</label>
          <Field name="name" type="text" class="form-control"/>
          <ErrorMessage name="name" class="error-feedback"/>
        </div>
        <div class="form-group">
          <label for="description">description</label>
          <Field name="description" type="text" class="form-control"/>
          <ErrorMessage name="description" class="error-feedback"/>
        </div>
        <div class="form-group">
          <label for="date">description</label>
          <Field name="date" type="datetime-local" class="form-control"/>
          <ErrorMessage name="date" class="error-feedback"/>
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
</template>
<script>

import moment from "moment";
import EventsService from "../services/events.service";
import {ErrorMessage, Field, Form} from "vee-validate";
import AccountService from "../services/account.service";
import * as yup from "yup";

export default {
  name: 'Event',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const invitationSchema = yup.object().shape({
      user: yup.string().required("Please select the user"),
    });

    return {
      event: {},
      invitations: [],
      contacts: [],
      isCreationOfInvitationActive: false,
      isChangerActive: false,
      loading: false,
      message: "",
      invitationSchema
    };
  },
  mounted() {
    EventsService.getEvent(this.$route.params.eventId).then(
        response => {
          this.event = response.data.event;
        },
        error => {
          alert('Error retrieving event dta');
        }
    );
    EventsService.getEventInvitations(this.$route.params.eventId).then(
        response => {
          this.invitations = response.data.invitations;
        },
        error => {
          alert('Error retrieving invitations data');
        }
    );
    this.getUninvitedContacts()
  },
  methods: {
    getUninvitedContacts() {
      EventsService.getUninvitedContacts(this.$route.params.eventId).then(
          response => {
            this.contacts = response.data.contacts;
          },
          error => {
            alert('Error retrieving contacts data');
          }
      );
    },
    getMoment(date) {
      return moment(date).calendar();
    },
    handleInvitation(invitation) {
      this.loading = true;
      EventsService.createInvitationEvent(parseInt(this.$route.params.eventId), parseInt(invitation.user)).then(
          response => {
            this.invitations.push(response.data.invitation);
            this.isCreationOfInvitationActive = false;
            this.contacts = [];
            this.loading = false;
            this.getUninvitedContacts();
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
    handleDeleteInvitation(invitation) {
      invitation.loading = true;
      EventsService.deleteEventInvitation(invitation.event.id, invitation.id).then(
          response => {
            console.log(this.invitations.splice(this.invitations.indexOf(invitation), 1));
            this.contacts = [];
            invitation.loading = false;
            this.getUninvitedContacts();
          },
          error => {
            alert('Error deleting invitation');
          }
      )
    }
  }
}
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