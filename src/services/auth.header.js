export default function authHeader() {
  let accessToken = JSON.parse(localStorage.getItem('accessToken'));

  if (accessToken) {
    return { Authorization: 'Bearer ' + accessToken }; // for Spring Boot back-end
  } else {
    return {};
  }
}
