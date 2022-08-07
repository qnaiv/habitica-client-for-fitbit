import * as document from "document";
import taskDetail from "./task-detail";

let taskData = {};

/**
 * タスク一覧表示
 */
export default ({tasks, taskType}) => {
  /** 一覧(VirtualTileList) */
  const VTList = document.getElementById("todoList");
   /** 習慣データ */
  taskData = tasks;

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
        tile.getElementById("text").text = `${taskData[info.index]?.text}`;
 
        // 習慣選択時のイベントを登録
        let touch = tile.getElementById("touch");
        touch.onclick = () => {
          document.location.assign("task-detail.view").then(() => {
            console.log("task detail loaded");
            taskDetail({
              taskDetail: taskData[info.index],
              taskType: taskType,
              onScoreTask: (id) => {
                 taskData = taskData.filter(task => task.id !== id);
                 VTList.length = taskData.length;
               },
            });
          })
        };
      }
    },
  };
  VTList.length = taskData.length;
}