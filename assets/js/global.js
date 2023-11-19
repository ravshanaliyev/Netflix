"use strict"

const addEventsOnElements = function (elements, eventType, callback){
    for(const elem of elements) elem.addEventListener(eventType, callback)
}

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventsOnElements(searchTogglers, "click", function(){
    searchBox.classList.toggle('active')
})

// Store movieId in localstorage when you click any card
const getMovieDetail = function(movieId){
    window.localStorage.setItem("movieId", String(movieId))
}
const getMovieList = function(urlParam, genreName){
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("genreName", genreName);
}