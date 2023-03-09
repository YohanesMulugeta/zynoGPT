import handleLogin from "./login.js";

const login = document.querySelector(".login-form");

login?.addEventListener("submit", handleLogin);
