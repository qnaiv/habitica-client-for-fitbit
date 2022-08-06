import * as document from "document";
export default (args) => {
    let toastText = document.getElementById("toast-text");
    toastText.text = args.message;
}