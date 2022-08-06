import * as document from "document";
import * as messaging from "messaging";
import Toast from "./toast"

// 表示対象の習慣データ
let currentHabit = {};

/**
 * 習慣詳細表示
 */
export default (habitDetail) => {
  currentHabit = habitDetail;

  // 習慣アクション実行後のトースト表示
  messaging.peerSocket.onmessage = (evt) => {
    console.log(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.command === "habit-action-result") {
      console.log("habit action result received");
      document.location.assign("toast.view").then(() => {
        Toast({
          message: `Done!  
  ${evt.data.result.dialog?evt.data.result.dialog:""}`, 
          time: 2000
        })
      })
    }
  }
  
  // 習慣テキスト表示
  document.getElementById("habit-title").text = habitDetail.text;

  // ＋ボタン
  const plusButton = document.getElementById("habit-plus");
  plusButton.addEventListener("click", () => sendHabitAction("up"));
  plusButton.text = "+";
  plusButton.style.display = currentHabit.up ? "inline" : "none";
  
  // －ボタン
  const minusButton = document.getElementById("habit-minus");
  minusButton.addEventListener("click", () => sendHabitAction("down"));
  minusButton.text = "-";
  minusButton.style.display = currentHabit.down ? "inline" : "none";
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
        habitId: currentHabit.id,
        action: action
      });
  }
}