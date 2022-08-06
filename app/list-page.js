import * as document from "document";

export default class ListPage {
  
  constructor({ habits,onHabitSelected }) {
    this.onHabitSelected = onHabitSelected;
    /** ListPageエレメント */
    this.element = document.getElementById("list");
    /** 一覧(VirtualTileList) */
    this.VTList = document.getElementById("todoList");
    /** 習慣データ */
    this.habits = habits;
  }

  /**
   * 描画
   */
  render() {
    const self = this;

    this.element.style.display = "inline";

    this.VTList.delegate = {
      getTileInfo: function (index) {
        return {
          type: "todo-pool",
          value: "Item",
          index: index,
        };
      },
      configureTile: function (tile, info) {
        if (info.type == "todo-pool") {
          tile.getElementById("text").text = `${self.habits[info.index]?.text}`;

          // 習慣選択時のイベントを登録
          let touch = tile.getElementById("touch");
          touch.onclick = () => {
            self.onHabitSelected(self.habits[info.index]);
          };
        }
      },
    };
    this.VTList.length = this.habits.length;
  }

  /**
   * 非表示
   */
  hide() {
    this.element.style.display = "none";
  }

}
