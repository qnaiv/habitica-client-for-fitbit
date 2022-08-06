import * as document from "document";
import * as messaging from "messaging";
import Toast from "./toast";


export default class HabitDetailPage {
    constructor(){
        this.toast = new Toast()
        messaging.peerSocket.onmessage = (evt) => {
            console.log(`App received: ${JSON.stringify(evt)}`);
            if (evt.data.command === "habit-action-result") {
                this.toast.showToast(`Done!  
${evt.data.result.dialog?evt.data.result.dialog:""}
`, 2000);
            }
        }

        this.currentHabit = {};
        this.element = document.getElementById("detail");

        const plusButton = document.getElementById("habit-plus");
        plusButton.addEventListener("click", () => this.sendHabitAction("up"));
        plusButton.text = "+";
        this.plusButton = plusButton;

        const minusButton = document.getElementById("habit-minus");
        minusButton.addEventListener("click", () => this.sendHabitAction("down"));
        minusButton.text = "-";
        this.minusButton = minusButton;
    }
    
    /**
     * 描画
     * @param {*} habitDetail 
     */
    render(habitDetail) {
      const self = this;
      this.currentHabit = habitDetail;
      this.element.style.display = "inline";
      
      document.getElementById("habit-title").text = habitDetail.text;
      
      this.plusButton.style.display = this.currentHabit.up ? "inline" : "none";
      this.minusButton.style.display = this.currentHabit.down ? "inline" : "none";
        
    }

    /**
     * 非表示
     */
    hide() {
        this.element.style.display = "none";
    }

    /**
     * 習慣アクション送信
     * @param {*} action 
     */
    sendHabitAction(action){
      console.log(`send habit action ${action}`);
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            command: `habit-action`,
            habitId: this.currentHabit.id,
            action: action
          });
      }
    }
  }