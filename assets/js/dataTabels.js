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
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(Ctable.content.cloneNode(true));
    }

    fetchData = async (api) => {
        try {
            const res = await fetch(api);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(`${data.description}`);
            }
            return data.data;
        } catch (e) {
            throw new Error(`Something went wrong! ${error}`);
        }
    };

    showtable = (data) => {
        let tbody = this.shadowRoot.querySelector("tbody");
        let thead = this.shadowRoot.querySelector("thead");

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

        let keys = Object.keys(data[0]);
        let tableHead = `
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

    search = (data) => {

        const searchText = this.shadowRoot.querySelector("#search").value.toLowerCase();
        localStorage.setItem("searchText", searchText);

        const newData = data.filter((v) => {
            if (v.id.toString().includes(searchText) || v.email.includes(searchText) || v.first_name.includes(searchText) || v.last_name.includes(searchText)) {
                return v;
            }
        });

        return newData;
    };

    /**
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
    sortTableByColumn(table, column, asc = true) {
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));

        // Sort each row
        const sortedRows = rows.sort((a, b) => {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });

        // Remove all existing TRs from the table
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        // Re-add the newly sorted rows
        tBody.append(...sortedRows);

        // Remember how the column is currently sorted
        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
    }
    async connectedCallback() {
        // get all values
        const props = { api: this.getAttribute("api") };
        const data = await this.fetchData(props.api);
        const storedData = JSON.parse(localStorage.getItem("data"));
        const searchText = localStorage.getItem("searchText");

        // get searchText
        this.shadowRoot.querySelector("#search").value = searchText;
        (storedData) ? this.showtable(storedData) : this.showtable(data);

        // get search result on keyup
        this.shadowRoot.querySelector("#search").addEventListener("keyup", () => {
            const newData = this.search(data);
            if (newData.length === 0) {
                this.shadowRoot.querySelector("tbody").innerHTML = "<span>Not Found</span>";
            } else {
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
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector("#search").addEventListener("keyup", () => {
            this.removeEventListener();
        });

        this.shadowRoot.querySelectorAll("th").forEach((th) => {
            th.addEventListener("click", () => {
                this.removeEventListener();
            });
        });
    }
}

window.customElements.define("d-tabel", DataTabels);