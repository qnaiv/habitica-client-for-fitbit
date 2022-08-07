export default class HabiticaApi {
  constructor() {
    this.userId = null;
    this.token = null;
    this.loginSuccessed = false;
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
      return res.success;
    });
  }

  /**
   * Habiticaからデータを取得する
   * @returns {Promise<void>} Habiticaデータ
   */
  async getTasks() {
    if(!this.loginSuccessed) {
      throw new Error("You are not logged in.");
    }
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
      const habit = res?.data?.filter((data) => data.type === "habit")
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

      const todo = res?.data?.filter((data) => data.type === "todo")
        .map((data) => {
          return { id: data.id, text: data.text, notes: data.notes };
        });
      const daily = res?.data?.filter((data) => data.type === "daily")
        .map((data) => {
          return { id: data.id, text: data.text, notes: data.notes };
        });
      return { habit, todo, daily };
    })
    .catch((err) => {
      console.log(err);
    });
  }

  async getStats() {
    if(!this.loginSuccessed) {
      throw new Error("You are not logged in.");
    }
    return fetch(`https://habitica.com/api/v3/user`, {
      headers: {
        Accept: "application/json",
        "x-api-user": this.userId,
        "x-api-key": this.token,
        // "userFields": "stats, profile",
      },
      method: "GET",
    })
    .then((response) => response.json())
    .then((res) => {
      return {
        name: res?.data?.profile?.name,
        hp: res?.data?.stats?.hp,
        mp: res?.data?.stats?.mp,
        exp: res?.data?.stats?.exp,
        gp: res?.data?.stats?.gp,
        lvl: res?.data?.stats?.lvl,
        maxHealth: res?.data?.stats?.maxHealth, 
        maxMP: res?.data?.stats?.maxMP,
        toNextLevel: res?.data?.stats?.toNextLevel,
      }
    })
    .catch((err) => {
      console.log(err);
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
