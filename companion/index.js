import HabiticaApi from "../common/HabiticaApi";
import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { outbox } from "file-transfer";
import * as cbor from 'cbor';

/*
 * Entry point for the companion app
 */

console.log("Companion code started");

let habiticaApi = new HabiticaApi();

settingsStorage.addEventListener("change", (event) => {
  login();
});

messaging.peerSocket.addEventListener("message", async (evt) => {
  if (evt.data && evt.data.command === "habit-action") {

    // モックデータ
    // messaging.peerSocket.send({
    //   command: `task-action-result`,
    //   result: {
    //     hp: 10,
    //     mp: 10,
    //     exp: 10,
    //     gp: 10,
    //   }
    // });
    const result = await habiticaApi.habitAction({id: evt.data.habitId, action: evt.data.action});
    messaging.peerSocket.send({
      command: `task-action-result`,
      result: result
    });
    console.log("action sent");
  }
});

async function login() {
  const userId = JSON.parse(settingsStorage.getItem("userId"))?.name;
  const token = JSON.parse(settingsStorage.getItem("token"))?.name;

  if (!userId || !token) {
    console.log("userId or token is not entered");
    return;
  }
  await habiticaApi.login({ userId, token });
}

async function sendTasks() {
  const tasks = await habiticaApi.getTasks();
  const stats = await habiticaApi.getStats();

  console.log(JSON.stringify(stats));
  outbox.enqueue('habitica-data.cbor', cbor.encode({
    habit: tasks.habit,
    daily: tasks.daily,
    todo: tasks.todo,
    stats: stats,
  }))
  .then(ft => { console.log('todos sent'); })
  .catch(error => { console.log("Error sending todos: " + error); });
}

async function init() {
  await login();
  await sendTasks();
}

init();
