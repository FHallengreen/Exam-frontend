import { API_URL } from "../../settings.js";
const URL = API_URL + "/attendees";
import { sanitizeStringWithTableRows } from "../../utils.js";

export function initAttendees (){

    showAttendeesTable();
}

async function showAttendeesTable() {
    document.getElementById("loading").classList.remove("d-none");
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      };
      const attendees = await fetch(URL, options).then((res) => res.json());
      console.log(attendees)

      const tableRows = attendees
        .map(
          (attendee) => `
          <tr>
              <td>${attendee.id}</td>
              <td>${attendee.username}</td>
              <td>${attendee.email}</td>
              <td>${attendee.phoneNumber}</td>
              </tr>`
        )
        .join("");
  
      const okRows = sanitizeStringWithTableRows(tableRows);
      document.getElementById("table-rows-attendees").innerHTML = okRows;
    } catch (error) {
      document.getElementById("error").innerText = error.message;
    } finally {
      document.getElementById("loading").classList.add("d-none");
    }
  }