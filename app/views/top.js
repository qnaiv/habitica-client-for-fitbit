import * as document from "document"
import taskList from "./task-list"

let habiticaData = {};

export default (data) => {
    habiticaData = data;
    
    // メニュー押下時のイベント登録
    document.getElementById("habit-list").addEventListener("click", handleClickHabitButton);
    document.getElementById("daily-list").addEventListener("click", handleClickDailyButton);
    document.getElementById("todo-list").addEventListener("click", handleClickTodoButton);
    
    // stats描画
    document.getElementById("label-profile").text = `${data.stats.profileName}`;
    document.getElementById("label-lvl").text = `Lv${data.stats.level}`;
    document.getElementById("label-hp").text = `${data.stats.currentHp}/${data.stats.maxHp}`;
    document.getElementById("label-mp").text = `${data.stats.currentMp}/${data.stats.maxMp}`;
    document.getElementById("label-exp").text = `${data.stats.currentExp}/${data.stats.toNextLevel}`;
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