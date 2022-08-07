import * as document from "document"
import taskList from "./views/task-list"
import { inbox } from "file-transfer";
import * as fs from "fs";

let habiticaData = {}

function init(){
  // ファイル転送受信時の処理
  try {
    let storedHabiticaData = fs.readFileSync("habitica-data.cbor", "cbor");
    habiticaData =  {
      todo: storedHabiticaData?.todo,
      habit: storedHabiticaData?.habit,
      daily: storedHabiticaData?.daily,
      stats: storedHabiticaData?.stats,
    };

    // stats描画
    console.log("stats: " + JSON.stringify(habiticaData.stats));
    const profileName = habiticaData.stats.name;
    const level = habiticaData.stats.lvl;
    const currentHp = Math.floor(habiticaData.stats.hp);
    const maxHp = Math.floor(habiticaData.stats.maxHealth);
    const currentExp = Math.floor(habiticaData.stats.exp);
    const toNextLevel = Math.floor(habiticaData.stats.toNextLevel);
    const currentMp = Math.floor(habiticaData.stats.mp);
    const maxMp = Math.floor(habiticaData.stats.maxMP);
    document.getElementById("label-profile").text = `${profileName}`;
    document.getElementById("label-lvl").text = `Lv${level}`;
    document.getElementById("label-hp").text = `${currentHp}/${maxHp}`;
    document.getElementById("label-mp").text = `${currentMp}/${maxMp}`;
    document.getElementById("label-exp").text = `${currentExp}/${toNextLevel}`;

    // メニュー押下時のイベント登録
    document.getElementById("habit-list").addEventListener("click", handleClickHabitButton);
    document.getElementById("daily-list").addEventListener("click", handleClickDailyButton);
    document.getElementById("todo-list").addEventListener("click", handleClickTodoButton);

    document.getElementById("main").style.display = "inline";
    document.getElementById("loading").style.display = "none";
  } catch (err) {
    console.log("Err " + err);
  }
}

function handleClickHabitButton(evt) {
    document.location.assign("task-list.view").then(() => {
      console.log("habit list loaded")
      taskList({
        tasks: habiticaData.habit,
        taskType: "habit"
      });
    })
}
function handleClickDailyButton(evt) {
    document.location.assign("task-list.view").then(() => {
      console.log("daily list loaded")
      taskList({
        tasks: habiticaData.daily,
        taskType: "daily"
      });
    })
}
function handleClickTodoButton(evt) {
    document.location.assign("task-list.view").then(() => {
      console.log("todo list loaded")
      taskList({
        tasks: habiticaData.todo,
        taskType: "todo"
      });
    })
}

/**
 * ファイル転送受信時の処理
 */
 inbox.onnewfile = () => {
  let fileName;
  while (fileName = inbox.nextFile()) {
      if (fileName === 'habitica-data.cbor') {
        init();
      }
  }
}