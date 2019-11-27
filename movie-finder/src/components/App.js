import React, { Component } from "react";

import Nav from "./Nav";
import SearchArea from "./SearchArea";
import MovieList from "./MovieList";
import Pagination from "./Pagination";
import MovieInfo from "./MovieInfo";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      searchTerm: "",
      totalResult: 0,
      currentPage: 1,
      currentMovie: null
    };

    this.apiKey = process.env.REACT_APP_API;
    console.log("my api key: ", this.apiKey);
  }

  handleSubmit = e => {
    e.preventDefault();
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.state.searchTerm}`
    )
      .then(data => data.json())
      .then(data => {
        console.log("rcvd data: ", data);
        this.setState({
          movies: [...data.results],
          totalResult: data.total_results
        });
      });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      searchTerm: e.target.value
    });
  };

  nextPage = pageNumber => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.state.searchTerm}&page=${pageNumber}`
    )
      .then(data => data.json())
      .then(data => {
        console.log("rcvd data from next fetch: ", data);
        this.setState({
          movies: [...data.results],
          currentPage: pageNumber
        });
      });
  };

  viewMovieInfo = id => {
    const filterdMovie = this.state.movies.filter(movie => movie.id == id);
    const newCurrentMovie = filterdMovie.length > 0 ? filterdMovie[0] : null;
    this.setState({ currentMovie: newCurrentMovie });
  };

  closeMovieInfo = () => {
    this.setState({ currentMovie: null });
  };

  render() {
    const numberPages = Math.floor(this.state.totalResult / 20);
    console.log("Total Page: ", numberPages);
    console.log("This is the current page: ", this.state.currentPage);
    return (
      <div>
        <Nav />
        {this.state.currentMovie == null ? (
          <div>
            <SearchArea
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
            />
            <MovieList
              viewMovieInfo={this.viewMovieInfo}
              movies={this.state.movies}
            />
          </div>
        ) : (
          <MovieInfo
            closeMovieInfo={this.closeMovieInfo}
            currentMovie={this.state.currentMovie}
          />
        )}

        {this.state.totalResult > 20 && this.state.currentMovie == null ? (
          <Pagination
            pages={numberPages}
            nextPage={this.nextPage}
            currentPage={this.state.currentPage}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
