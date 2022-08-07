import * as document from "document";
import * as messaging from "messaging";
import Toast from "./toast"

// 表示対象の習慣データ
let currentTask = {};

/**
 * 習慣詳細表示
 */
export default ({taskDetail, taskType, onScoreTask}) => {
  currentTask = taskDetail;

  // アクション実行後のトースト表示
  messaging.peerSocket.onmessage = (evt) => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.command === "task-action-result") {
      console.log("action result received");
      onScoreTask(currentTask.id);
      document.location.replace("toast.view").then(() => {
        Toast({
          message: `Done!  
  ${evt.data.result.dialog?evt.data.result.dialog:""}`, 
          time: 2000
        })
      })
    }
  }
  
  // タスクタイトル
  document.getElementById("task-title").text = taskDetail.text;

  if(taskType === 'habit'){
    // ＋ボタン
    const plusButton = document.getElementById("habit-plus");
    plusButton.addEventListener("click", () => sendHabitAction("up"));
    plusButton.style.display = currentTask.up ? "inline" : "none";
    
    // －ボタン
    const minusButton = document.getElementById("habit-minus");
    minusButton.addEventListener("click", () => sendHabitAction("down"));
    minusButton.style.display = currentTask.down ? "inline" : "none";
  } else {
    const checkButton = document.getElementById("task-check");
    checkButton.addEventListener("click", () => sendHabitAction("up"));
    checkButton.style.display = "inline";
  }
}

/**
 * 習慣アクション送信
 * @param {*} action 
 */
function sendHabitAction(action){
  console.log(`send habit action ${action}`);
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: `habit-action`,
        habitId: currentTask.id,
        action: action
      });
  }
}