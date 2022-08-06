import * as document from "document"
import habitList from "./views/habit-list"
import { inbox } from "file-transfer";
import * as fs from "fs";

function init(){
  // ファイル転送受信時の処理
  try {
    let storedHabiticaData = fs.readFileSync("habitica-data.cbor", "cbor");
    const habiticaData =  {
      todo: storedHabiticaData?.todo,
      habit: storedHabiticaData?.habit,
      daily: storedHabiticaData?.daily,
    };
    document.location.assign("habit-list.view").then(() => {
      console.log("habit list loaded")
      habitList(habiticaData.habit);
    })
  } catch (err) {
    console.log("Err " + err);
  }

}

// document.onkeypress = (evt) => {
//   if (evt.key === "back") {
//     try{
//       document.history.back();
//       evt.preventDefault();
//     } catch (err) {
      
//     }
//   }
// }

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