const currentPage = window.location.pathname;
console.log(currentPage);

//high light active links
const highlightActiveLinks = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
};

const init = () => {
  switch (currentPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      break;
    case "/show.html":
      console.log("Shows");
      break;
    case "/movie-details.html":
      console.log("Movie Details");
      break;
    case "/tv-details.html":
      console.log("TV Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActiveLinks();
};

document.addEventListener("DOMContentLoaded", init);
