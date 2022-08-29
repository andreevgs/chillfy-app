import api from "./api";


class EventsService {
    getEvents() {
        return api.get('/events');
    }
    getEvent(eventId) {
        return api.get(`/events/${eventId}`);
    }
    getInvitations() {
        return api.get('/events/invitations');
    }
    getEventInvitations(eventId){
        return api.get(`/events/${eventId}/invitations`);
    }
    getUninvitedContacts(eventId){
        return api.get(`/events/${eventId}/uninvited`);
    }

    createEvent(event) {
        return api.post('/events', {event});
    }
    createInvitationEvent(eventId, userId) {
        return api.post(`/events/${eventId}/invitations`, {invitation: {userId, eventId}});
    }

    deleteEventInvitation(eventId, invitationId){
        return api.delete(`/events/${eventId}/invitations/${invitationId}`);
    }
}

export default new EventsService();
