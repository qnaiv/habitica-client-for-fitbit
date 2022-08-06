export default class HabiticaApi {
  constructor() {
    this.userId = null;
    this.token = null;
    this.loginSuccessed = false;
    this.habit = null;
    this.todo = null;
    this.daily = null;
  }

  /**
   * ログイン
   * @param {{userId: string;token: string}} credentials 
   */
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

  /**
   * Habiticaからデータを取得する
   * @returns {Promise<void>} Habiticaデータ
   */
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
          return { 
            id: data.id, 
            text: data.text, 
            notes: data.notes,
            up: data.up,
            down: data.down,
            counterUp: data.counterUp,
            counterDown: data.counterDown,
            };
        });

      this.todo = res?.data?.filter((data) => data.type === "todo")
        .map((data) => {
          return { id: data.id, text: data.text, notes: data.notes };
        });
      this.daily = res?.data?.filter((data) => data.type === "daily")
        .map((data) => {
          return { id: data.id, text: data.text, notes: data.notes };
        });
    });
  }

  /**
   * 習慣を実行する
   */
  async habitAction(habit) {
    return fetch(`https://habitica.com/api/v3/tasks/${habit.id}/score/${habit.action}`, {
      headers: {
        Accept: "application/json",
        "x-api-user": this.userId,
        "x-api-key": this.token,
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(JSON.stringify(res));
        return {
          hp: res.data.hp,
          mp: res.data.mp,
          exp: res.data.exp,
          gp: res.data.gp,
          dialog: res.data?._tmp?.drop?.dialog,
        }
      });
  }
}
