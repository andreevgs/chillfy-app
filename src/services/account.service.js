import api from "./api";

class AccountService {
    getContacts(){
        return api.get('/account/contacts');
    }
    createContactRequest(secondUserId){
        return api.post('/account/contacts/requests', {request: {secondUserId}});
    }
    changeContactRequest(requestId, status) {
        return api.patch('/account/contacts/requests/' + requestId, {request: {status}});
    }
    deleteContactRequest(requestId) {
        return api.delete('/account/contacts/requests/' + requestId);
    }
    deleteFromContacts(requestId) {
        return api.delete('/account/contacts/requests/active/' + requestId);
    }
}

export default new AccountService();
