"use strict"
import { sidebar } from "./sidebar.js"
import { apiKey, imageBaseURL, fetchDataFromServer } from "./api.js"
import {createMovieCard} from './movie-card.js'
import { createSearch } from "./search.js";
const pageContent = document.querySelector("[page-content]");

sidebar()

// Home page sections (top rated, upcoming, trending, movies )
const homePageSections = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming"
    },
    {
        title: "Week\'s Trending Movies",
        path: "/trending/movie/week"
    },
    {
        title: "Top Rated Movies",
        path: "/movie/top_rated"
    },
];

const genreList = {
    asString(genreList){
        let   newGenreList = []
        for(const genreId of genreList){
            this[genreId] && newGenreList.push(this[genreId])
        }
        return newGenreList.join(', ')
    }
};
fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
    function ({ genres }) {
        for (const { id, name } of genres) {
        genreList[id] = name;
        }

    fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
    heroBanner
    );

    }
);


const heroBanner = function ({ results: movieList }) {
  const $banner = document.createElement("section");
  $banner.classList.add("banner");
  $banner.ariaLabel = "Popular Movies";

  $banner.innerHTML = `
        <div class="banner-slider">
        </div>
        <div class="slider-control">
            <div class="control-inner">
            
            </div>
        </div>
    `;
  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${imageBaseURL}w1280${backdrop_path}"
        class="img-cover"
        loading=${index}
        alt="${title === 0 ? "eager" : "lazy"}"
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">${overview}</p>
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt=""
          />
          <span class="span">Watch Now</span>
        </a>
      </div>
    `;

    $banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);
    controlItemIndex++;
    controlItem.innerHTML = `
            <button class="poster-box slider-item">
                <img
                src="${imageBaseURL}w154${poster_path}"
                loading="lazy"
                draggable="false"
                alt="Slide to ${title}"
                class="img-cover"
                />
            </button>
        `;
    $banner.querySelector(".control-inner").appendChild(controlItem);
    }
    pageContent.appendChild($banner);

    addHeroSlide();

    // fetch data for Home page sections (top rated, upcoming, trending, movies )
    for(const {title, path} of homePageSections){
        fetchDataFromServer(
            `https://api.themoviedb.org/3${path}?api_key=${apiKey}&page=1`,
            createMovieList, title
        );
    }
}

const addHeroSlide = function(){
    const sliderItems = document.querySelectorAll("[slider-item]")
    const sliderControls = document.querySelectorAll('[slider-control]')

    let lastSliderItem = sliderItems[0]
    let lastSliderControl = sliderControls[0]
    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function(){
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        sliderItems[Number(this.getAttribute('slider-control'))].classList.add("active")
        this.classList.add('active')

        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))]
        lastSliderControl = this
    }

    addEventsOnElements(sliderControls, 'click', sliderStart)
}

const createMovieList = function({results: movieList}, title){
    const $movieList = document.createElement('section')
    $movieList.classList.add('movie-list')
    $movieList.ariaLabel = `${title}`
    $movieList.innerHTML = `
        <div class="title-wrapper">
                <h3 class="title-large">${title}</h3>
            </div>
            <div class="slider-list">
                <div class="slider-inner"></div>
            </div>
    `
    for(const movie of movieList){
        const movieCard = createMovieCard(movie)
        $movieList.querySelector('.slider-inner').appendChild(movieCard)
    }
    pageContent.appendChild($movieList)
}

createSearch()