import { API_URL } from "../../settings.js";
const token = localStorage.getItem("token");

export async function validateToken() {
    try {
        const response = await fetch(API_URL + "/auth/validateToken", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return false;
        }
        else {
            return true;
        }

    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
}

export function updateRestrictedLinks() {
    const role = localStorage.getItem("roles") || "";
  
    const adminLinks = document.querySelectorAll(".admin-link");
    adminLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        link.style.display = role.includes("ADMIN") ? "block" : "none";
      }
    });
  
    const userLinks = document.querySelectorAll(".user-link");
    userLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        link.style.display =
          role.includes("ADMIN") || role.includes("USER") ? "block" : "none";
      }
    });
  
    const anonymousLinks = document.querySelectorAll(".anonymous-link");
    anonymousLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        link.style.display = role === "anonymous" ? "block" : "none";
      }
    });
    
    const loggedOutLinks = document.querySelectorAll(".logged-out-link");
  loggedOutLinks.forEach((link) => {
    if (link instanceof HTMLElement) {
      link.style.display = role === "" ? "block" : "none";
    }
  });
  }