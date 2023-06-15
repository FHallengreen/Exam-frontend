//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below
import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadHtml
} from "./utils.js"
import { updateRestrictedLinks } from "./pages/login/auth.js"
import { validateToken } from "./pages/login/auth.js"

import { initLogin } from "./pages/login/login.js"
import {initEvents } from "./pages/events/events.js"
import {initEventAttendees} from "./pages/e-attendees/e-attendees.js"
import {initAttendees} from "./pages/attendees/attendees.js"

window.addEventListener("load", async () => {

  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  const templateLogin = await loadHtml("./pages/login/login.html")
  const templateEvents = await loadHtml("./pages/events/events.html")
  const templateEventAttendees = await loadHtml("./pages/e-attendees/e-attendees.html")
  const templateAttendees = await loadHtml("./pages/attendees/attendees.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => {
        document.getElementById("content").innerHTML = `
        <h1>Welcome to Hallengreen Event Hub</h1>
        <img src="images/background.png" alt="Background Image" style="height: 50%">
      `;
      updateRestrictedLinks();
      if (localStorage.getItem("token") == null){
        window.router.navigate("/login");
      }
      },
      "/login": (match) => {
        renderTemplate(templateLogin, "content")
        initLogin()
        updateRestrictedLinks();
      },
      "/events": () => {
        renderTemplate(templateEvents, "content")
        initEvents()
        updateRestrictedLinks();
      },
      "/eventattendees": () => {
        renderTemplate(templateEventAttendees, "content")
        initEventAttendees()
        updateRestrictedLinks();
      },
      "/attendees": () => {
        renderTemplate(templateAttendees, "content")
        initAttendees()
        updateRestrictedLinks();
      },
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}