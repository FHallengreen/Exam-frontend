import { API_URL } from "../../settings.js";
const URL = API_URL + "/attendees";
import { handleHttpErrors, encode } from "../../utils.js";
import { updateRestrictedLinks } from "./auth.js";

export function initLogin() {
    const token = localStorage.getItem("token");
  checkIfLoggedIn();

  document.getElementById("loginBtn").onclick = login;
document.getElementById("logoutBtn").addEventListener('click', logout);

}

function checkIfLoggedIn(){
    const token = localStorage.getItem("token");

    if (token) {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "block";
    } else {
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
    }
}

async function login(evt) {
  evt.preventDefault();
  document.getElementById("error").innerText = "";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const dtoBody = { username, password };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dtoBody),
  };

  try {
    const response = await fetch(API_URL + "/auth/login", options).then((res) =>
      handleHttpErrors(res)
    );
    localStorage.setItem("token", response.token);
    localStorage.setItem("roles", response.roles);
    localStorage.setItem("username", response.username);
    checkIfLoggedIn();
    window.router.navigate("");
    location.reload();
  } catch (err) {
    console.log(err.message);
  }
}

 function logout() {
    localStorage.clear();
    checkIfLoggedIn();
    updateRestrictedLinks();
    window.location.href = "/";
}
