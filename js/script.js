const currentPage = window.location.pathname;
console.log(currentPage);

//Fetch data from TMDB server
const fetchApiData = async (endpoint) => {
  const api_key = "86104454e33bd2e857294e8a7e7b45db";
  const api_url = "https://api.tmdb.org/3/";

  showSpinner();

  const response = await fetch(
    `${api_url}${endpoint}?api_key=${api_key}&language=en-US`
  );

  const data = await response.json();
  hideSpinner();
  return data;
};

//show spinner while loading
const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};

const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
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

//display popular shows
const displayPopoularShows = async () => {
  // use distructure to convert result from objects to arrays
  const { results } = await fetchApiData("tv/popular");
  console.log(results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
    ${
      show.poster_path
        ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="Movie Title"
/>`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${show.name}</h5>
    <p class="card-text">
      <small class="text-muted">Air Date: ${show.first_air_date}</small>
    </p>
  </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
};

//Display movie details
const displayMovieDetails = async () => {
  const movieId = window.location.search.split("=")[1];
  console.log(movieId);

  const movie = await fetchApiData(`movie/${movieId}`);
  console.log(movie.production_companies);
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
  <div>
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
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)}/ 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
    ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${formNum(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${formNum(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${movie.runtime}min</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
      
      ${movie.production_companies.map((company) => `${company.name}`)}
  </div>
</div>
  `;
  document.querySelector("#movie-details").appendChild(div);
};

// add commas to number
const formNum = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    case "/shows.html":
      displayPopoularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
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
