"use strict"
const apiKey = "8b26984ad4614038cc833306cb4dbdef";
const imageBaseURL = "https://image.tmdb.org/t/p/";

const fetchDataFromServer = (url, callback, optionalParam) =>{
    fetch(url)
        .then(res => res.json())
        .then(data => callback(data, optionalParam))
}
export {imageBaseURL, apiKey,   fetchDataFromServer}