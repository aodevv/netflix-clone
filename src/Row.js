import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import './Row.css';
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer';

const base_url = "http://image.tmdb.org/t/p/original/";

function Row({title, fetchUrl, isLarge}) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    // A SNIPPET OF code whoch runs on a specefic condition

    useEffect(() => {
        // if blank [], run once whhen row load, and don't run again
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            // console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl ]);

    const opts = {
        heigth: "390",
        width: "100%",
        playerVars:{
            autoplay: 1,

        },
    }
    // console.table(movies);

    const handleClick = (movie) => {
        const mName = movie?.name || '';
        console.log(mName);
        if(trailerUrl){
            setTrailerUrl('');
        } else {
            movieTrailer(mName)
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                console.log(urlParams.get('v'));
                setTrailerUrl(urlParams.get('v'));
            }).catch(error => console.log(error));
        }
    }

    return (
        <div className="row">
            {/* title */}
            <h2>{title}</h2>
            <div className="row__posters">
                {/* Several row poster(s) */}
                {movies.map(movie => (
                    <img
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row__poster ${isLarge && "row__posterLarge"}`} 
                    src={`${base_url}${isLarge ? movie.poster_path : movie.backdrop_path}`} 
                    alt={movie.name}/>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row
