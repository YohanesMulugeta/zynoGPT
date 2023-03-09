import { handleLogin, handleLogout } from "./login.js";

const login = document.querySelector(".login-form");
const logout = document.querySelector(".btn-logout");

login?.addEventListener("submit", handleLogin);
logout?.addEventListener("click", handleLogout);
