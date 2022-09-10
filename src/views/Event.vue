<template>
  <div class="container">
    <header class="jumbotron">
      <h2>Event {{ event?.name }}</h2>
    </header>
    <div v-if="isChangerActive">
      <div class="col-md-12">
        <div class="card card-container">
          <Form @submit="handleUpdation" :validation-schema="eventSchema">
            <div class="form-group">
              <label for="name">Name of event</label>
              <Field name="name" type="text" class="form-control" :value="event?.name"/>
              <ErrorMessage name="name" class="error-feedback"/>
            </div>
            <div class="form-group">
              <label for="description">description</label>
              <Field name="description" type="text" class="form-control" :value="event?.description"/>
              <ErrorMessage name="description" class="error-feedback"/>
            </div>
            <div class="form-group">
              <label for="date">Date and time</label>
              <Field name="date" type="datetime-local" class="form-control" :value="getTimeWithTimeZone(event?.date)"/>
              <ErrorMessage name="date" class="error-feedback"/>
            </div>

            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="eventLoading">
                <span
                    v-show="eventLoading"
                    class="spinner-border spinner-border-sm"
                ></span>
                <span>Update event</span>
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
          <button class="btn btn-danger btn-block" v-on:click="isChangerActive = false">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="isCreationOfInvitationActive">
      <div class="col-md-12">
        <div class="card card-container">
          <Form @submit="handleInvitation" :validation-schema="invitationSchema">
            <div class="form-group">
              <label for="user">Select user to invite</label>
              <Field name="user" as="select">
                <option disabled selected>Select user</option>
                <option v-for="(contact, index) in contacts"
                        :key="index" :value="contact.firstUser ? contact.firstUser.id : contact.secondUser.id">
                  {{ contact.firstUser ? contact.firstUser.firstName : contact.secondUser.firstName }}
                  {{ contact.firstUser ? contact.firstUser.lastName : contact.secondUser.lastName }}
                </option>
              </Field>
              <ErrorMessage name="user" class="error-feedback"/>
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="invitationLoading">
            <span
                v-show="invitationLoading"
                class="spinner-border spinner-border-sm"
            ></span>
                <span>Invite user to event</span>
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
          <button class="btn btn-danger btn-block" v-on:click="isCreationOfInvitationActive = false">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="!isCreationOfInvitationActive && !isChangerActive">
      <p>
        {{ event?.description }}
      </p>
      <p>
        {{ getMoment(event?.date) }}
      </p>
      <button class="btn btn-primary btn-block" v-on:click="isChangerActive = true">Change event</button>
      <button class="btn btn-danger btn-block" v-on:click="handleDeletion" :disabled="eventDeletionLoading">
        <span
            v-show="eventDeletionLoading"
            class="spinner-border spinner-border-sm"
        ></span>
        <span>Delete event</span>
      </button>
      <h3>Invitations:</h3>
      <button class="btn btn-primary btn-block" v-on:click="isCreationOfInvitationActive = true">Invite user</button>
      <div v-if="!invitations.length">
        <p>No invitations yet</p>
      </div>
      <ul v-if="invitations.length" class="list-group">
        <li class="list-group-item"
            v-for="(invitation, index) in invitations"
            :key="index"
        >
          <p>{{ invitation.user.firstName }} {{ invitation.user.lastName }}</p>
          <p
              v-if="invitation.status"
              v-bind:style="[
                  invitation.status.id === 2 ? {color: 'red'} : invitation.status.id === 3 ? {color: 'orange'} : {color: 'limegreen'}
              ]"
          >
            {{ invitation.status.nameEn }}
          </p>
          <p v-if="!invitation.status">No answer yet</p>
          <p>{{ invitation.user.username }}</p>
          <button
              class="btn btn-danger btn-block"
              v-on:click="handleDeleteInvitation(invitation)"
              :disabled="invitation.loading"
          >
            <span
                v-show="invitation.loading"
                class="spinner-border spinner-border-sm"
            ></span>
            Cancel invitation
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import EventsService from "../services/events.service";
import {ErrorMessage, Field, Form} from "vee-validate";
import AccountService from "../services/account.service";
import * as yup from "yup";
import socket from "@/services/socket";

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
    const eventSchema = yup.object().shape({
      name: yup.string().required("Name is required!"),
      description: yup.string(),
    });

    return {
      event: {},
      invitations: [],
      contacts: [],
      isCreationOfInvitationActive: false,
      isChangerActive: false,
      invitationLoading: false,
      eventLoading: false,
      eventDeletionLoading: false,
      disableAllEventFields: false,
      message: "",
      invitationSchema,
      eventSchema
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
    getTimeWithTimeZone(date) {
      const now = new Date(date);
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    },
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
    },
    handleUpdation(event) {
      this.eventLoading = true;
      EventsService.updateEvent(this.$route.params.eventId, event).then(
          response => {
            this.event = response.data.event;
            this.isChangerActive = false
          },
          error => {
            this.eventLoading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      )
    },
    handleDeletion() {
      this.eventDeletionLoading = false;
      EventsService.deleteEvent(this.$route.params.eventId).then(
          response => {
            this.$router.push("/events");
          },
          error => {
            this.eventDeletionLoading = false;
          }
      )
    }
  },
  created() {
    socket.connect();
    socket.on("change card", ({content, to}) => {
      console.log('change card: ', content)
      const foundInvitation = this.invitations.find(invitation => invitation.id === to);
      if(foundInvitation){
        this.invitations[this.invitations.indexOf(foundInvitation)].status = content;
      }
    });
  },
  destroyed() {
    socket.off('change card');
    socket.disconnect();
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