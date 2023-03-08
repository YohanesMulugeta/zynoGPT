const navbar = document.querySelector(".navbar");
const scrollTop = document.querySelector(".scroll-top");

window.onscroll = () => {
  if (window.scrollY > 10) {
    navbar.classList.add("nav-active");
    scrollTop.classList.remove("opacity-0");
  } else {
    navbar.classList.remove("nav-active");
    scrollTop.classList.add("opacity-0");
  }
};

var typed = new Typed("#typed", {
  strings: [
    "Essay Writing",
    "Assignment Writing",
    "Cover Letter Writing",
    "Notes Writing",
    "StartUp Ideas",
    "Hashtags writing",
    "Much more...",
  ],
  backSpeed: 30,
  backDelay: 1300,
  typeSpeed: 30,
  loop: true,
});
