import api from "./api";


class UsersService {
  getCurrent() {
    return api.get('/users/current');
  }

  getAll() {
    return api.get('/users');
  }
}

export default new UsersService();
