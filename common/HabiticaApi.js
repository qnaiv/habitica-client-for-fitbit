export default class HabiticaApi {
  constructor() {
    this.userId = null;
    this.token = null;
    this.loginSuccessed = false;
    this.habit = null;
    this.todo = null;
    this.daily = null;
  }

  async login(credentials) {
    this.userId = credentials.userId;
    this.token = credentials.token;
    return fetch("https://habitica.com/api/v3/tasks/user", {
      headers: {
        Accept: "application/json",
        "x-api-user": this.userId,
        "x-api-key": this.token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        this.loginSuccessed = res.success;
      });
  }

  async getData() {
    //   return fetch(encodeURI('https://habitica.com/api/v3/tasks/user'), {
    return fetch("https://habitica.com/api/v3/tasks/user", {
      headers: {
        Accept: "application/json",
        "x-api-user": this.userId,
        "x-api-key": this.token,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        this.habit = res?.data?.filter((data) => data.type === "habit")
          .map((data) => {
            return { id: data.id, text: data.text };
          });
        this.todo = res?.data?.filter((data) => data.type === "todo")
          .map((data) => {
            return { id: data.id, text: data.text };
          });
        this.daily = res?.data?.filter((data) => data.type === "daily")
          .map((data) => {
            return { id: data.id, text: data.text };
          });
      });
  }
}
