import { API_URL } from "../../settings.js";
const URL = API_URL + "/events";
import { sanitizeStringWithTableRows } from "../../utils.js";
import { formatDate } from "../../utils.js";
import { validateToken } from "../login/auth.js";

const token = localStorage.getItem("token");

export async function initEvents() {
  document.getElementById("message").innerText = "";
  document.getElementById("error").innerText = "";

  const isLoggedIn = await validateToken();
  if (!isLoggedIn) {
    // Redirect or handle the case when the token is invalid
    window.router.navigate("/");
    return;
  }
  document
    .getElementById("searchEventForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      searchEvent();
    });
  showEventsTable();

  document.getElementById('deleteEventButton').addEventListener('click', deleteEvent)
  document.getElementById('createEventForm').addEventListener('submit', function(event){
    event.preventDefault();
    createEvent();
});

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
        Authorization: `Bearer ${token}`,
      },
    };
    const events = await fetch(URL, options).then((res) => res.json());
    const tableRows = events
      .map(
        (event) => `
        <tr>
            <td>${event.id}</td>
            <td>${event.name}</td>
            <td>${formatDate(event.date)}</td>
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

async function createEvent(){

  const newEventName = document.getElementById('newEventName').value;
  const newEventDate = document.getElementById('newEventDate').value;
  const newEventDescription = document.getElementById('newEventDescription').value;
  const newEventCapacity = document.getElementById('newEventCapacity').value;

  const event = {
    name: newEventName,
    date: newEventDate,
    description: newEventDescription,
    capacity: (newEventCapacity)
};

try {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event)
  });

  if(response.ok){
    await response.json();

    showEventsTable();
    document.getElementById("message").innerText = "Event created successfully";
  }else{
    const errorData = await response.json();
    const errorMessage = errorData.message;
    document.getElementById("error").innerText = "Error: " + errorMessage;
  }
} catch (error) {
  console.error('Error:', error);
}
}

async function deleteEvent(){
  const eventId = document.getElementById('eventId').value;
  
  try {
    const response = await fetch(URL + `/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
      },
    });

    if(response.ok){
      showEventsTable();
      document.getElementById("message").innerText = "Event deleted";
    }else{
      const errorData = await response.json();
      const errorMessage = errorData.message;
      document.getElementById("error").innerText = "Error: " + errorMessage;
    }
} catch (error) {
    document.getElementById("error").innerText = "Error: " + error.message;
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
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(URL + "/" + eventId, options);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      document.getElementById("error").innerText = errorMessage;
    } else {
      const event = await response.json();

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
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  };

  try {
    const response = await fetch(URL +`/${id}`, options);
    if (response.ok) {
      showEventsTable();
      resetFields();
      document.getElementById("message").innerText = "Event updated";
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
