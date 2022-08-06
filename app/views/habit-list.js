import * as document from "document";
import habitDetail from "./habit-detail";

/**
 * 習慣一覧表示
 */
export default (habits) => {
  /** 一覧(VirtualTileList) */
  const VTList = document.getElementById("todoList");
  /** 習慣データ */
  const habits = habits;

  VTList.delegate = {
    getTileInfo: function (index) {
      return {
        type: "todo-pool",
        value: "Item",
        index: index,
      };
    },
    configureTile: function (tile, info) {
      if (info.type == "todo-pool") {
        tile.getElementById("text").text = `${habits[info.index]?.text}`;

        // 習慣選択時のイベントを登録
        let touch = tile.getElementById("touch");
        touch.onclick = () => {
          document.location.assign("habit-detail.view").then(() => {
            console.log("habit detail loaded");
            habitDetail(habits[info.index]);
          })
        };
      }
    },
  };
  VTList.length = habits.length;
}