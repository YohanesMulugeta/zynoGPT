import essay from "./features/essay.js";
import { handleLogin, handleLogout } from "./login.js";
import handleSignup from "./signup.js";

const login = document.querySelector(".login-form");
const signup = document.querySelector(".signup-form");
const logout = document.querySelector(".btn-logout");

// FEATURES
const feature = document.getElementById(
  document.title.toLowerCase()?.split("|")[1]?.trim()?.split(" ")?.join("-")
);

console.log(feature);

login?.addEventListener("submit", handleLogin);
logout?.addEventListener("click", handleLogout);
signup?.addEventListener("submit", handleSignup);

feature?.addEventListener("submit", essay.generateText.bind(essay));
