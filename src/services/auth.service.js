import api from './api';
import authHeader from "./auth.header";

class AuthService {
  login(user) {
    return api
      .post('/auth/signin', {
        user: {
          email: user.email,
          password: user.password
        }
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        return response.data;
      });
  }

  logout() {
    let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    return api.get('/auth/logout', {headers: {Authorization: 'Bearer ' + refreshToken}})
        .then(response => {

          return response.data
        })
        .catch((error) => {
          return error;
        })
        .finally(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        });
  }

  register(user) {
    return api.post('/auth/signup', {
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        password: user.password
      }
    });
  }

  confirm(confirmation) {
    return api.post('/auth/confirmation', {
      confirmation: {
        email: confirmation.email,
        password: confirmation.password,
        code: confirmation.code
      }
    });
  }

  code(user) {
    return api.post('/auth/code', {
      user: {
        email: user.email,
        password: user.password
      }
    });
  }

  codeForRestore(email) {
    return api.post('/auth/restore/code', {
      user: {
        email
      }
    });
  }

  changePassword(user) {
    return api.post('/auth/restore', {
      user: {
        confirmationCode: parseInt(user.code),
        email: user.email,
        newPassword: user.newPassword
      }
    });
  }

  refreshTokens() {
    return api.get('/tokens', { headers: authHeader() });
  }
}

export default new AuthService();
