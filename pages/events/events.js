import { API_URL } from "../../settings.js";
const URL = API_URL + "/events";
import { sanitizeStringWithTableRows } from "../../utils.js";

export async function initEvents() {
  document.getElementById("error").innerText = "";
  document
    .getElementById("searchEventForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      searchEvent();
    });
  showEventsTable();

  document
    .getElementById("editEventForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      saveEvent();
      showEventsTable();
    });
}

async function showEventsTable() {
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
    console.log(events);
    const tableRows = events
      .map(
        (event) => `
        <tr>
            <td>${event.id}</td>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.description}</td>
            </tr>`
      )
      .join("");

    const okRows = sanitizeStringWithTableRows(tableRows);
    document.getElementById("table-rows-events").innerHTML = okRows;
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  } finally {
    document.getElementById("loading").classList.add("d-none");
  }
}

async function searchEvent() {
  document.getElementById("error").innerText = "";
  try {
    const eventId = document.getElementById("searchEventId").value;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(URL + "/" + eventId, options);

    if (!response.ok) {
    } else {
      const event = await response.json();

      console.log(event);

      document.getElementById("eventId").value = event.id;
      document.getElementById("eventName").value = event.name;
      document.getElementById("eventDateTime").value = event.date;
      document.getElementById("eventDescription").value = event.description;

      document.getElementById("editEventForm").style.display = "block";
    }
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
}

async function saveEvent() {
  const id = document.getElementById("eventId").value;
  const name = document.getElementById("eventName").value;
  const date = document.getElementById("eventDateTime").value;
  const description = document.getElementById("eventDescription").value;

  const event = {
    id: id,
    name: name,
    description: description,
    date: date,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  };

  try {
    const response = await fetch(`${URL}/${id}`, options);
    if (response.ok) {
      showEventsTable();
      resetFields();
      console.log("Event updated successfully");
    }
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
}

function resetFields() {
  document.getElementById("searchEventId").value = "";
  document.getElementById("eventId").value = "";
  document.getElementById("eventName").value = "";
  document.getElementById("eventDateTime").value = "";
  document.getElementById("eventDescription").value = "";
  document.getElementById("editEventForm").style.display = "none";
}
