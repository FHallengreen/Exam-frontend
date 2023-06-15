import { API_URL } from "../../settings.js";
const URL = API_URL + "/attendees";
import { sanitizeStringWithTableRows } from "../../utils.js";
import { validateToken } from "../login/auth.js";
const token = localStorage.getItem("token");

export async function initAttendees (){
    const isLoggedIn = await validateToken();
    if (!isLoggedIn) {
      // Redirect or handle the case when the token is invalid
      window.router.navigate("/");
      return;
  }
    showAttendeesTable();
}

async function showAttendeesTable() {
    document.getElementById("loading").classList.remove("d-none");
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response  = await fetch(URL, options)
     
      const attendees = await response.json();
    
      const tableRows = attendees
        .map(
          (attendee) => `
          <tr>
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