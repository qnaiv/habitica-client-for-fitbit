import * as document from "document";

export default class Toast {
    constructor() {
        this.element = document.getElementById("toast");
        this.toastText = document.getElementById("toast-text");
    }

    showToast(message, time) {
        this.element.style.display = "inline";
        this.toastText.text = message;
        setTimeout(() => {
            this.element.style.display = "none";
        }, time);
    }

}