const navbarWrapper = document.querySelector(".navbar-fixed");
const navbar = navbarWrapper.querySelector("nav");
const largeLogo = navbarWrapper.querySelector(".logo");
const smallLogo = navbarWrapper.querySelector(".brand-logo");

window.addEventListener("scroll", () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    navbar.classList.remove("transparent");
    navbarWrapper.classList.add("navbar--animate");
    smallLogo.classList.remove("hide");
    largeLogo.classList.add("hide");
  } else {
    navbarWrapper.classList.remove("navbar--animate");
    navbar.classList.add("transparent");
    smallLogo.classList.add("hide");
    largeLogo.classList.remove("hide");
  }
});
