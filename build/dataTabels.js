"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Ctable = document.createElement("template");
Ctable.innerHTML = `
<style>
.table-sortable {
font-family: Arial, Helvetica, sans-serif;
border-collapse: collapse;
width: 100%;
}

.table-sortable td, .table-sortable th {
border: 1px solid #ddd;
padding: 8px;
}

.table-sortable tr:nth-child(even) {
    background-color: #f2f2f2;
}

.table-sortable th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
	cursor: pointer;
}

.table-sortable th:hover {
    background-color: #ddd;
}

input[type=search] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}
</style>

<div class ="d-tabels">
    <h1 class="text-center">Storing API data in table</h1>
    <div>
        <input type="search" id="search" placeholder="Search..">
    </div>

    <div>
        <table id = "customers" class="table-sortable">
            <thead></thead>
            <tbody></tbody>
        </table>
    </div>
</div>
`;
class DataTabels extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.fetchData = (api) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(api);
                const data = yield res.json();
                if (!res.ok) {
                    throw new Error(`${data.description}`);
                }
                return data.data;
            }
            catch (error) {
                throw new Error(`Something went wrong! ${error}`);
            }
        });
        this.showtable = (data) => {
            var _a, _b;
            const tbody = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("tbody");
            const thead = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("thead");
            let tableData = "";
            data.map((values) => {
                tableData += `            
            <tr>
            <td>${values.id}</td>
            <td>${values.email}</td>
            <td>${values.first_name}</td>
            <td>${values.last_name}</td>
            <td><img src="${values.avatar}"/></td>
            </tr>
            `;
            });
            const keys = Object.keys(data[0]);
            const tableHead = `
        <tr>
            <th id="id">${keys[0]}</th>
            <th id="email">${keys[1]}</th>
            <th id="first_name">${keys[2]}</th>
            <th id="last_name">${keys[3]}</th>
            <th id="avatar">${keys[4]}</th>
        </tr>
        `;
            tbody.innerHTML = tableData;
            thead.innerHTML = tableHead;
        };
        this.search = (data) => {
            var _a;
            const searchElement = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#search");
            const searchText = searchElement.value.toLowerCase();
            localStorage.setItem("searchText", searchText);
            const newData = data.filter((v) => {
                if (v.id.toString().includes(searchText) || v.email.includes(searchText) || v.first_name.includes(searchText) || v.last_name.includes(searchText)) {
                    return v;
                }
            });
            return newData;
        };
        this.attachShadow({ mode: "open" });
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(Ctable.content.cloneNode(true));
    }
    /**
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
    sortTableByColumn(table, column, asc = true) {
        var _a, _b;
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
        // Sort each row
        const sortedRows = rows.sort((a, b) => {
            var _a, _b, _c, _d;
            const aColText = (_b = (_a = a.querySelector(`td:nth-child(${column + 1})`)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            const bColText = (_d = (_c = b.querySelector(`td:nth-child(${column + 1})`)) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
            if (aColText !== undefined && bColText !== undefined) {
                return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
            }
            return -1;
        });
        // Remove all existing TRs from the table
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }
        // Re-add the newly sorted rows
        tBody.append(...sortedRows);
        // Remember how the column is currently sorted
        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        (_a = table.querySelector(`th:nth-child(${column + 1})`)) === null || _a === void 0 ? void 0 : _a.classList.toggle("th-sort-asc", asc);
        (_b = table.querySelector(`th:nth-child(${column + 1})`)) === null || _b === void 0 ? void 0 : _b.classList.toggle("th-sort-desc", !asc);
    }
    connectedCallback() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // get all values
            const props = { api: this.getAttribute("api") };
            const data = yield this.fetchData(props.api);
            const storedData = JSON.parse(localStorage.getItem("data"));
            const searchText = localStorage.getItem("searchText");
            // get searchText
            let searchElement = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#search");
            searchElement.value = searchText;
            (storedData) ? this.showtable(storedData) : this.showtable(data);
            // get search result on keyup
            (_c = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#search")) === null || _c === void 0 ? void 0 : _c.addEventListener("keyup", () => {
                const newData = this.search(data);
                if (newData.length === 0) {
                    this.shadowRoot.querySelector("tbody").innerHTML = "<span>Not Found</span>";
                }
                else {
                    this.showtable(newData);
                    localStorage.setItem("data", JSON.stringify(newData));
                }
            });
            // sort
            this.shadowRoot.querySelectorAll(".table-sortable th").forEach(headerCell => {
                headerCell.addEventListener("click", () => {
                    const tableElement = headerCell.parentElement.parentElement.parentElement;
                    const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
                    const currentIsAscending = headerCell.classList.contains("th-sort-asc");
                    this.sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
                });
            });
        });
    }
    disconnectedCallback() {
        this.shadowRoot.querySelector("#search").addEventListener("keyup", () => {
            this.removeEventListener("keyup", () => { });
        });
        this.shadowRoot.querySelectorAll("th").forEach((th) => {
            th.addEventListener("click", () => {
                this.removeEventListener("click", () => { });
            });
        });
    }
}
window.customElements.define("d-tabel", DataTabels);
