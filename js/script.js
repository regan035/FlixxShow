const currentPage = window.location.pathname;
console.log(currentPage);

//Fetch data from TMDB server
const fetchApiData = async (endpoint) => {
  const api_key = "86104454e33bd2e857294e8a7e7b45db";
  const api_url = "https://api.tmdb.org/3/";

  const response = await fetch(
    `${api_url}${endpoint}?api_key=${api_key}&language=en-US`
  );

  const data = await response.json();
  return data;
};

//display popular movies
const displayPopoularMovies = async () => {
  // use distructure to convert result from objects to arrays
  const { results } = await fetchApiData("movie/popular");
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `<img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="Movie Title"
/>`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${movie.title}</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${movie.release_date}</small>
    </p>
  </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
};

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
      displayPopoularMovies();
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
