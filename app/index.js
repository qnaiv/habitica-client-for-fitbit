import * as document from "document";
import * as fs from "fs";
import { inbox } from "file-transfer";
import ListPage from "./list-page";
import HabitDetailPage from "./habit-detail-page";

/**
 * ルーティング
 */
class Router {
  constructor(pages) {
    this.currentPage = "ListPage";
    this.pages = pages;
  }

  /**
   * ページ切り替え
   * @param {*} page ページ名
   * @param {*} obj renderメソッドに渡すオブジェクト
   */
  switchPage(page, obj) {
    if (page === "ListPage") {
      this.currentPage = "ListPage";
      this.pages["ListPage"].render();
      this.pages["HabitDetailPage"].hide();
    } else if (page === "HabitDetailPage") {
      this.currentPage = "HabitDetailPage";
      this.pages["HabitDetailPage"].render(obj);
      this.pages["ListPage"].hide();
    }
  }

  /**
   * 前ページに戻る
   * @param {*} evt 
   */
  switchPrevPage(evt) {
    if (evt.key === "back") {
      console.log(`back pressed. currentPage: ${this.currentPage}`);
      if (this.currentPage === "ListPage") {
      } else if (this.currentPage === "HabitDetailPage") {
        // Go to list page
        this.switchPage("ListPage");
        evt.preventDefault();
      }
    }
  }
}

/**
 * 習慣データ取得
 * @returns {object} habiticaData
 */
function getStoredHabiticaData() {
  try {
    let storedHabiticaData = fs.readFileSync("habitica-data.cbor", "cbor");
    console.log(JSON.stringify(storedHabiticaData));
    return {
      todo: storedHabiticaData?.todo,
      habit: storedHabiticaData?.habit,
      daily: storedHabiticaData?.daily,
    };
  } catch (err) {
    console.log("Err " + err);
  }
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

function init(){
  const router = new Router({
    ListPage: new ListPage({
      habits: getStoredHabiticaData().habit,
      onHabitSelected: (habitData) => router.switchPage("HabitDetailPage", habitData),
    }),
    HabitDetailPage: new HabitDetailPage(),
  });
  
  // ListPageを表示
  router.switchPage("ListPage");

  /**
   * ボタン押下時の処理
   * @param {*} evt 
   * @returns 
   */
  document.onkeypress = (evt) => router.switchPrevPage(evt);
}
