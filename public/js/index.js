import { handleLogin, handleLogout } from "./login.js";
import handleSignup from "./signup.js";

const login = document.querySelector(".login-form");
const signup = document.querySelector(".signup-form");
const logout = document.querySelector(".btn-logout");

login?.addEventListener("submit", handleLogin);
logout?.addEventListener("click", handleLogout);
signup?.addEventListener("submit", handleSignup);

console.log(signup);
