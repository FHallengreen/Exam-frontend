

export function initLogin (){

    document.getElementById("password").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("loginBtn").click();
        }
      });
      document.getElementById("username").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("loginBtn").click();
        }
      });

      
}