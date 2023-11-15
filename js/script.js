//set global state
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "86104454e33bd2e857294e8a7e7b45db",
    apiUrl: "https://api.tmdb.org/3/",
  },
};
console.log(global.currentPage);

//Fetch data from TMDB server
const fetchApiData = async (endpoint) => {
  const api_key = global.api.apiKey;
  const api_url = global.api.apiUrl;

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

//init swiper
const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
};

//display sliders
const displaySliders = async () => {
  const { results } = await fetchApiData("movie/now_playing");
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
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
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
    </h4>
  
    `;
    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
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
  //display background image in detail page
  displayBackgroundImage("movie", movie.backdrop_path);
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

//Display tvshow details
const displayshowDetails = async () => {
  const showId = window.location.search.split("=")[1];
  const show = await fetchApiData(`tv/${showId}`);
  console.log(show);
  //display background image in detail page
  displayBackgroundImage("tv", show.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
  <div>
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
alt="show name"
/>`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)}/ 10
    </p>
    <p class="text-muted">First Air Date: ${show.first_air_date}</p>
    <p>
    ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Origin Country:</span> ${
      show.origin_country
    }</li>
    <li><span class="text-secondary">Languages:</span> ${show.languages
      .map((language) => language.toUpperCase())
      .join("")}</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
      
      ${show.production_companies.map((company) => `${company.name}`)}
  </div>
</div>
  `;
  document.querySelector("#show-details").appendChild(div);
};

//search movies/tv shows
const search = async () => {
  const searchString = window.location.search;
  const urlParams = new URLSearchParams(searchString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  if (global.search.term !== "" && global.search.term !== null) {
    // display search results
    const { results, total_pages, page } = await searchApiData();
    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);

    //clear input fields
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a term");
  }
};

//display search results
const displaySearchResults = (results) => {
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
    ${
      result.poster_path
        ? `<img
    src="https://image.tmdb.org/t/p/w500${result.poster_path}"
    class="card-img-top"
    alt="${global.search.type === "movie" ? result.title : result.name}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${global.search.type === "movie" ? result.title : result.name}"
/>`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${
      global.search.type === "movie" ? result.title : result.name
    }</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${
        global.search.type === "movie"
          ? result.release_date
          : result.first_air_date
      }</small>
    </p>
  </div>`;
    document.querySelector("#search-results").appendChild(div);
  });
};

// display alert
const showAlert = (message, className = "error") => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
};

//make request to search
const searchApiData = async (endpoint) => {
  const api_key = global.api.apiKey;
  const api_url = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${api_url}search/${global.search.type}?api_key=${api_key}&language=en-US&query=${global.search.term}`
  );

  const data = await response.json();
  hideSpinner();
  return data;
};

//diplay overlay background image
const displayBackgroundImage = (type, backroundPath) => {
  const backgroundDiv = document.createElement("div");
  backgroundDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backroundPath})`;
  backgroundDiv.style.backgroundSize = "cover";
  backgroundDiv.style.backgroundPosition = "center";
  backgroundDiv.style.backgroundRepeat = "no-repeat";
  backgroundDiv.style.height = "100vh";
  backgroundDiv.style.width = "100vw";
  backgroundDiv.style.position = "absolute";
  backgroundDiv.style.top = "0";
  backgroundDiv.style.left = "0";
  backgroundDiv.style.zIndex = "-1";
  backgroundDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(backgroundDiv);
  } else {
    document.querySelector("#show-details").appendChild(backgroundDiv);
  }
};

// add commas to number
const formNum = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
//high light active links
const highlightActiveLinks = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
};

const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySliders();
      displayPopoularMovies();
      break;
    case "/shows.html":
      displayPopoularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayshowDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLinks();
};

document.addEventListener("DOMContentLoaded", init);
