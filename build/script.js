"use strict";
// version_01
// function myFetch(url, type, data) {
//     /* GET */
//     if (type === "GET") {
//         return fetch(url, {
//             method: type,
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//             .then(res => {
//                 if (res.ok) console.log("HTTP request successful")
//                 else console.log("HTTP request unsuccessful")
//                 return res;
//             })
//             .then(res => res.json())
//             .then(data => data)
//             .catch(error => error);
//     }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//     /* DELETE */
//     if (type === "DELETE") {
//         return fetch(url, {
//             method: type,
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//             .catch(error => error);
//     }
//     /* POST or PUT */
//     if (type === "POST" || type === "PUT") {
//         return fetch(url, {
//             method: type,
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//             .then(res => {
//                 if (res.ok) console.log("HTTP request successful");
//                 else console.log("HTTP request unsuccessful");
//                 return res;
//             })
//             .then(res => res.json())
//             .then(data => data)
//             .catch(error => error)
//     }
// }
// // get res
// // version_02
// function fetchDataWithThen() {
//     fetch("https://reqres.in/api/users")
//         .then(res => {
//             if (!res.ok) {
//                 console.log("HTTP request unsuccessful");
//                 return;
//             }
//             return res.json();
//         })
//         .then(data => console.log(data.data[3].first_name))
//         .catch(error => console.log(error));
// }
// fetchDataWithThen();
// // version_03
// async function fetchDataWithAsync() {
//     try {
//         const res = await fetch("https://reqres.in/api/users");
//         const data = await res.json();
//         if(!res.ok) {
//             console.log(data.description);
//             return;
//         }
//         console.log(data.data[3].first_name);
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchDataWithAsync();
//-------------------------------------------------------------------------
// post res
// const newUser = {
//     name: "test",
//     job: "test"
// };
// // version_03
// async function postDataWithAsync() {
//     try {
//         const res = await fetch("https://reqres.in/api/users", {
//             method: "POST",
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(newUser)
//         });
//         const data = await res.json();
//         if(!res.ok) {
//             console.log(data.description);
//             return;
//         }
//         console.log(data);
//     } catch (error) {
//         console.log(error)
//     }
// }
// postDataWithAsync();
// async function fetchData(url, type, data) {
//     /*GET*/
//     if (type === "GET") {
//         try {
//             const res = await fetch(url);
//             const data = await res.json();
//             if (!res.ok) {
//                 console.log(data.description);
//                 return;
//             }
//             console.log(data.data[3].first_name);
//             return data;
//         } catch (error) {
//             throw new Error(`Something went wrong! ${error}`)
//         }
//     }
//     /*POST || PUT*/
//     if (type === "POST" || type === "PUT") {
//     }
//     /*DELETE*/
//     if (type === "DELETE") {
//     }
// }
// const data = fetchData("https://reqres.in/api/users", "GET");
// console.log(data);
// console.log(data.data[3].first_name);
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("https://reqres.in/api/users");
            const data = yield res.json();
            if (!res.ok) {
                throw new Error(`Something went wrong! ${data.description}`);
            }
            let tableData = "";
            data.data.map((values) => {
                tableData += `            
            <tr>
            <td>${values.id}</td>
            <td>${values.email}</td>
            </tr>`;
            });
            const table_body = document.getElementById("table_body");
            table_body.innerHTML = tableData;
        }
        catch (error) {
            throw new Error(`Something went wrong! ${error}`);
        }
    });
}
fetchData();
