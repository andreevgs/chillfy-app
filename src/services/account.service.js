import api from "./api";

class AccountService {
    createContactRequest(secondUserId){
        return api.post('/account/contacts/requests', {request: {secondUserId}});
    }
    changeContactRequest(requestId, status) {
        return api.patch('/account/contacts/requests/' + requestId, {request: {status}});
    }
    deleteContactRequest(requestId) {
        return api.delete('/account/contacts/requests/' + requestId);
    }
}

export default new AccountService();
