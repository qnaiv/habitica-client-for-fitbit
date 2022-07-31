import * as fs from "fs";
import * as document from "document";
import * as messaging from "messaging";


// let VTList = document.getElementById('todoList');
// let habiticaData = {};
let listScreen = document.getElementById("list");
let detailScreen = document.getElementById("detail");
let currentScreen = "ListPage";

class Router {
  constructor() {
    this.currentPage = "ListPage";

    // page element
    this.listPageElm = document.getElementById("list");
    this.habitDetailPageElm = document.getElementById("detail");

    // page controller
    this.listPage = new ListPage();
    this.habitDetailPage = new HabitDetailPage();

    document.onkeypress = function (evt) {
      if (evt.key === "back") {
        console.log("back pressed");
        if (currentScreen === "ListPage") {
          console.log("listpage");
        } else if (currentScreen === "HabitDetailPage") {
          console.log("habitdetailpage");
          // Go to list page
          this.switchPage("ListPage");
          evt.preventDefault();
        }
      }
    };
  }

  switchPage(page, obj) {
    if (page === "ListPage") {
      this.listPageElm.style.display = "inline";
      this.habitDetailPageElm.style.display = "none";
      this.currentPage = "ListPage";
      this.listPage.render();
    } else if (page === "DetailPage") {
      this.listPageElm.style.display = "none";
      this.habitDetailPageElm.style.display = "inline";
      this.currentPage = "DetailPage";
      this.habitDetailPage.render(obj);
    }
  }
}

class ListPage {
  VTList = document.getElementById("todoList");
  habiticaData = {};
  render() {
    currentScreen = "ListPage";
    const self = this;
    listScreen.style.display = "inline";
    detailScreen.style.display = "none";

    self.habiticaData = this.getStoredHabiticaData();
    self.VTList.delegate = {
      getTileInfo: function (index) {
        return {
          type: "todo-pool",
          value: "Item",
          index: index,
        };
      },
      configureTile: function (tile, info) {
        if (info.type == "todo-pool") {
          const habits = self.habiticaData?.habit;
          tile.getElementById("text").text = `${habits[info.index]?.text}`;

          let touch = tile.getElementById("touch");
          touch.onclick = function () {
            router.switchPage("DetailPage", habits[info.index]);
          };
        }
      },
    };
    self.VTList.length = self.habiticaData.todo.length;
  }

  getStoredHabiticaData() {
    try {
      let storedHabiticaData = fs.readFileSync("habitica-data.cbor", "cbor");
      return {
        todo: storedHabiticaData?.todo,
        habit: storedHabiticaData?.habit,
        daily: storedHabiticaData?.daily,
      };
    } catch (err) {
      console.log("Err " + err);
    }
  }
}

class HabitDetailPage {
  currentHabit = {};
  render(habitDetail) {
    const self = this;
    this.currentHabit = habitDetail;
    currentScreen = "HabitDetailPage";
    listScreen.style.display = "none";
    detailScreen.style.display = "inline";
    
    document.getElementById("habit-title").text = habitDetail.text;
    const plusButton = document.getElementById("habit-plus");
    plusButton.text = "+";
    plusButton.addEventListener("click", function (evt) {
        console.log("plus button clicked");
        self.sendHabitAction("plus");
    });
    const minusButton = document.getElementById("habit-minus");
    minusButton.text = "-";
    minusButton.addEventListener("click", function (evt) {
        console.log("minus button clicked");   
        self.sendHabitAction("minus");
    });
  }
  sendHabitAction(action){
    console.log("send habit action");
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          command: `habit-${action}`,
          habitId: this.currentHabit.id,
        });
    }
  }
}

const router = new Router();
router.switchPage("ListPage");
