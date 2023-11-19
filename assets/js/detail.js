'use strict'
import { apiKey, imageBaseURL, fetchDataFromServer } from "./api.js"
import { sidebar } from "./sidebar.js"
import { createMovieCard } from "./movie-card.js"
import { createSearch } from "./search.js"

const movieId = window.localStorage.getItem('movieId')
const pageContent = document.querySelector("[page-content]")



sidebar()


const getGenres = function(genreList){
    const newGenreList = []
    for(const {name} of genreList) newGenreList.push(name)
    return newGenreList.join(", ")
}
const getCasts = function (castList) {
  const newCastList = [];
  for (let i = 0, len = castList.length; i < len  && i < 10; i++){
    const {name} = castList[i]
    newCastList.push(name)
  } 
  return newCastList.join(", ");
};
const getDirector = function(crewList){
    const directors = crewList.filter(({job}) => job === "Director")
    const directorList = []
    for (const { name } of directors) directorList.push(name);
    return directorList.join(", ")
}
const filterVideos = function(videoList){
    return videoList.map(({type, site}) => (type === "Trailor" || type === "Teaser") && site === "Youtube").slice(0,5)
}
console.log(filterVideos);
fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=casts,videos,images,releases`, function(movie){
    console.log(movie);
    const {backdrop_path, poster_path, title, release_date, runtime, vote_average, releases: {countries: [{certification}]}, genres, overview, casts: {cast, crew}, videos: {results: videos}} = movie
    console.log(videos);

    document.title = `${title} - TvFlix`
    const $movieDetail = document.createElement('div')
    $movieDetail.classList.add('movie-detail')
    $movieDetail.innerHTML = `
        <div class="backdrop-image" style="background: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}');"></div>
            <figure class="poster-box movie-poster">
                <img src="${imageBaseURL}w342${poster_path}" alt="" class="img-cover">
            </figure>
            <div class="detail-box">
                <div class="detail-content">
                    <h1 class="heading">${title}</h1>
                    <div class="meta-list">
                        <div class="meta-item">
                            <img src="./assets/images/star.png" width="20" height="20" alt="">
                            <span class="span">${vote_average.toFixed(1)}</span>
                        </div>
                        <div class="separator"></div>
                        <div class="meta-item">${runtime}m</div>
                        <div class="separator"></div>
                        <div class="meta-item">${release_date.split("-")[0]}</div>
                        <div class="meta-item card-badge">${certification}</div>
                    </div>
                    <p class="genre">
                        ${getGenres(genres)}
                    </p>
                    <p class="overview">
                        ${overview}
                    </p>
                    <ul class="detail-list">
                        <div class="list-item">
                            <p class="list-name">Starring</p>
                            <p>
                                ${getCasts(cast)}
                            </p>
                        </div>
                        <div class="list-item">
                            <p class="list-name">Directed By</p>
                            <p>
                                ${getDirector(crew)}
                            </p>
                        </div>
                    </ul>
                </div>
                <div class="title-wrapper">
                    <h3 class="title-large">
                        Trailors and Clips
                    </h3>
                </div>
                <div class="slider-list">
                    <div class="slider-inner" slider-video></div>
                </div>
            </div>
    `
    for(const {key, name} of filterVideos(videos)){
        const $videoCard = document.createElement('div')
        $videoCard.classList.add('video-card')
        $videoCard.innerHTML = `
            <iframe width="500" height="230" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0"    allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `   
        $movieDetail.querySelector(".slider-inner").appendChild($videoCard)
    }
    pageContent.appendChild($movieDetail)

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1&api_key=${apiKey}`, addSuggestedMovies
    );
    
});

const addSuggestedMovies = function ({ results: movieList }, title) {
  const $movieList = document.createElement("section");
  $movieList.classList.add("movie-list");
  $movieList.ariaLabel = "You May Also Like";
  $movieList.innerHTML = `
        <div class="title-wrapper">
                <h3 class="title-large">You May Also Like</h3>
            </div>
            <div class="slider-list">
                <div class="slider-inner"></div>
            </div>
    `;
  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    $movieList.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild($movieList);
};

createSearch()
