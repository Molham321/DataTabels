"use strict";
const template = document.createElement("template");
template.innerHTML = `
    <style>
    .user-card {
        font-family: Arial, Helvetica, sans-serif;
        background: #f4f4f4;
        width: 500px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-gap: 10px;
        margin-bottom: 15px;
        border-bottom: darkorchid 5px solid;
    }

    .user-card img {
        width: 100%;
    }

    .user-card button {
        cursor: pointer;
        background:  darkorchid;
        color: #fff;
        border: 0;
        border-radius: 5px;
        padding: 5px 10px;
    }

    h3 {
        color: coral;
    }

    </style>
    <div class="user-card">
        <div>
            <img />
        </div>
        <div>
            <h3></h3>
            <div class="info">
                <p><slot name="email"></p>
                <p><slot name="phone"></p>
            </div>
            <button id="toggle-info">Hide Info</button>
        </div>
    </div>
`;
class UserCard extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.showInfo = true;
        this.attachShadow({ mode: "open" });
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(template.content.cloneNode(true));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.shadowRoot.querySelector("h3").innerText = this.getAttribute("name");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.shadowRoot.querySelector("img").src = this.getAttribute("avatar");
    }
    toggelInfo() {
        var _a, _b;
        this.showInfo = !this.showInfo;
        const info = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".info");
        const toggleBtn = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#toggle-info");
        if (this.showInfo) {
            info.style.display = "block";
            toggleBtn.innerText = "Hide info";
        }
        else {
            info.style.display = "none";
            toggleBtn.innerText = "Show info";
        }
    }
    connectedCallback() {
        var _a, _b;
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#toggle-info")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            this.toggelInfo();
        });
    }
    disconnectedCallback() {
        var _a, _b;
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#toggle-info")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            this.removeEventListener("click", () => {
                this.toggelInfo();
            });
        });
    }
}
window.customElements.define("user-card", UserCard);
