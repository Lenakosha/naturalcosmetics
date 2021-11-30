let serverUrl = "http://localhost:3000";
let isAuth = false;
let login = "";

document.addEventListener("DOMContentLoaded", authStart);

async function authStart() {
  let auth = localStorage.getItem("auth");
  let unloggedBtn = document.querySelector("#unlogged_btn");

  if (auth) {
    let resp = await fetch(serverUrl + "/user/info", {
      headers: { Authorization: auth },
    });
    if (resp.status === 200) {
      let respData = await resp.json();
      if (!respData.isError) {
        isAuth = true;
        login = respData.data.login;

        let logged = document.querySelector("#logged_btn");
        logged.classList.remove("d-none");
        logged.innerText = login;
        unloggedBtn.classList.add("d-none");
      }
    }
  }

  if (isAuth && location.href.includes("authorization.html")) {
    location.href = "client.html";
  }

  let loginForm = document.querySelector("#login-form");
  let regForm = document.querySelector("#register-form");

  console.log(loginForm);

  if (loginForm) {
    loginForm.onsubmit = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      onLogin();
      return false;
    };
  }
  if (regForm) {
    regForm.onsubmit = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      onRegister();
      return false;
    };
  }
}

async function onLogin() {
  let login = document.querySelector("#log_email").value;
  let passw = document.querySelector("#log_password").value;

  let resp = await fetch(serverUrl + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: login,
      password: passw,
    }),
  });
  let errorText = null;
  try {
    let respData = await resp.json();
    console.log(respData);
    if (respData.isError) {
      errorText = respData.text;
    } else {
      localStorage.setItem("auth", respData.data);
      console.log("Авторизовались!");
      location.href = "client.html";
      return;
    }
  } catch (err) {
    errorText = err + "";
  }

  document.querySelector("#login_messages").innerText = errorText;
}

async function onRegister() {
  let mail = document.querySelector("#reg_email").value;
  let login = document.querySelector("#reg_login").value;
  let passw = document.querySelector("#reg_password").value;

  let resp = await fetch(serverUrl + "/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      mail: mail,
      login: login,
      password: passw,
    }),
  });
  let errorText = null;
  try {
    let respData = await resp.json();
    console.log(respData);
    if (respData.isError) {
      errorText = respData.text;
    } else {
      console.log("Зарегистрировались!");
      location.hash = "#login_block";
      return;
    }
  } catch (err) {
    errorText = err + "";
  }

  document.querySelector("#register_message").innerText = errorText;
}
