import * as document from "document";
import taskDetail from "./task-detail";

/**
 * タスク一覧表示
 */
export default ({tasks, taskType}) => {
  /** 一覧(VirtualTileList) */
  const VTList = document.getElementById("todoList");
  /** 習慣データ */

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
        tile.getElementById("text").text = `${tasks[info.index]?.text}`;

        // 習慣選択時のイベントを登録
        let touch = tile.getElementById("touch");
        touch.onclick = () => {
          document.location.assign("task-detail.view").then(() => {
            console.log("task detail loaded");
            taskDetail({
              taskDetail: tasks[info.index],
              taskType: taskType
            });
          })
        };
      }
    },
  };
  VTList.length = tasks.length;
}