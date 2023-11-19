"use strict";
import { apiKey, fetchDataFromServer } from './api.js'
import { sidebar } from "./sidebar.js"
import { createMovieCard } from './movie-card.js';
import { createSearch } from './search.js';
const pageContent = document.querySelector("[page-content]")

const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");
let currentPage = 1
let totalPages = 0

fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${currentPage}&sort_by=popularity.desc&${urlParam}&api_key=${apiKey}`, function ({ results: movieList, total_pages }) {
    totalPages = total_pages
    document.title = `${genreName} Movies - Tvflix`
    const $movieList = document.createElement("section")
    $movieList.classList.add("movie-list", "genre-list")
    $movieList.ariaLabel = `${genreName} Movies`
    $movieList.innerHTML = `
        <div class="title-wrapper">
                <h1 class="heading">All ${genreName} Movies</h3>
            </div>
            <div class="grid-list"></div>
            <button class="btn load-more" load-more>See More</button>
    `;
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie)
        $movieList.querySelector(".grid-list").appendChild(movieCard)
    }
    pageContent.appendChild($movieList)
    document.querySelector("[load-more]").addEventListener("click", function () {
        if (currentPage >= totalPages) {
            this.style.display = "none"
            return
        }
        currentPage++
        this.classList.add("loading")
        fetchDataFromServer(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${currentPage}&sort_by=popularity.desc&${urlParam}&api_key=${apiKey}`,
            ({ results: movieList }) => {
                this.classList.remove("loading");
                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);
                    $movieList.querySelector(".grid-list").appendChild(movieCard);
                }
            }
        );
    })
});

sidebar()
createSearch()