import { API_URL } from "../../settings.js";
// const URL = API_URL + "/eventattendees";
// const EVENT_URL = API_URL + "/eventattendees/available-events";
import { sanitizeStringWithTableRows } from "../../utils.js";

export async function initEventAttendees() {
    document.getElementById("message").innerText = "";
    fetchAvailableEvents()
    fetchAttendees()
    loadAttendeeEvents()

    const table = document.getElementById("table-rows-attendee-events");

    table.addEventListener("click", async function (event) {
        if (event.target.classList.contains("delete-button")) {
            // Get the id from the button's data-id attribute
            const id = event.target.getAttribute("data-id");
            await deleteEvent(id);
        }
    });

    document.getElementById("addUserToEvent")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addAttendeeToEvent();
    });
}

async function fetchAvailableEvents() {
    const URL = API_URL + "/events/available-events";
    try {
        const response = await fetch(URL);
        const events = await response.json();

        const eventSelect = document.getElementById("eventSelect");

        events.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.text = event.name;
            eventSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching available events:", error);
    }
}

async function fetchAttendees(){
    const URL = API_URL + "/attendees";
    try {
        const response = await fetch(URL);
        const attendees = await response.json();

        const userSelect = document.getElementById("userSelect");

        attendees.forEach((attendee) => {
            const option = document.createElement("option");
            option.value = attendee.id;
            option.text = attendee.username;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching available attendees:", error);
    }
}

async function addAttendeeToEvent(){

    document.getElementById("errorMessage").innerHTML ="";
    document.getElementById("message").innerHTML ="";

const URL = API_URL + "/eventattendees"
    const eventId = document.getElementById("eventSelect").value;
    const attendeeId = document.getElementById("userSelect").value;

    const requestBody = {
        event: {
            id: eventId
        },
        attendee: {
            id: attendeeId
        }
    };

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      };

    try{
        const response = await fetch(URL,options);
        if(response.ok){
            const responseData = await response.json();
            const { attendee, event } = responseData;
            const message = `Congrats ${attendee.username}! You are going to see ${event.name} on ${formatDate(event.date)}.`;
            document.getElementById("message").innerText = message;
            loadAttendeeEvents()
        }
        else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            document.getElementById("errorMessage").innerText = errorMessage;
        }
    }
    catch (error){
        console.error("Error adding attendee to the event:", error);
    }

}

async function loadAttendeeEvents(){
    const URL = API_URL + "/eventattendees"
    document.getElementById("loading").classList.remove("d-none");
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      };
      const events = await fetch(URL, options).then((res) => res.json());
      const tableRows = events
        .map(
          (event) => `
          <tr>
              <td>${event.event.name}</td>
              <td>${formatDate(event.event.date)}</td>
              <td><button class="btn btn-danger delete-button" data-id="${event.id}">Delete</button></td>
              </tr>`
        )
        .join("");
  
      const okRows = sanitizeStringWithTableRows(tableRows);
      document.getElementById("table-rows-attendee-events").innerHTML = okRows;
    } catch (error) {
      document.getElementById("error").innerText = error.message;
    } finally {
      document.getElementById("loading").classList.add("d-none");
    }
}

async function deleteEvent(id) {
    const URL = API_URL + "/eventattendees/" + id;
    try {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch(URL, options);
        if (response.ok) {
            document.getElementById("messageTable").innerText = "Event deleted successfully";
            loadAttendeeEvents();
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            document.getElementById("errorMessage").innerText = errorMessage;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

