import api from "./api";


class UsersService {
  getCurrent() {
    return api.get('/users/current');
  }

  getAll() {
    return api.get('/users', {params: {limit: 7}});
  }
}

export default new UsersService();
