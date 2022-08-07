import * as document from "document"
import { inbox } from "file-transfer";
import * as fs from "fs";
import Top from "./views/top";

function init(){
  // ファイル転送受信時の処理
  try {
    let storedHabiticaData = fs.readFileSync("habitica-data.cbor", "cbor");
    let habiticaData =  {
      todo: storedHabiticaData?.todo,
      habit: storedHabiticaData?.habit,
      daily: storedHabiticaData?.daily,
      stats: {
        profileName: storedHabiticaData.stats.name,
        level: storedHabiticaData.stats.lvl,
        currentHp: Math.floor(storedHabiticaData.stats.hp),
        maxHp: Math.floor(storedHabiticaData.stats.maxHealth),
        currentExp: Math.floor(storedHabiticaData.stats.exp),
        toNextLevel: Math.floor(storedHabiticaData.stats.toNextLevel),
        currentMp: Math.floor(storedHabiticaData.stats.mp),
        maxMp: Math.floor(storedHabiticaData.stats.maxMP),
      },
    };
    document.location.replace("top.view").then(() => {
      Top(habiticaData);
    });
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