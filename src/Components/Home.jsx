import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import './style.css';
import logo from '../Components/assets/poke-logo.png';

const Card = lazy(() => import("./PokoCards"));

const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [disable, setDisable] = useState(true);

  const pokeFunc = async () => {
    const res = await axios.get(url);

    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemonData(res.data.results);
    setLoading(false);

    console.log("PREV", res.data.previous);
    console.log("NEXT", res.data.next);

    setDisable(res.data.previous !== null ? false : true);
  };

  const getPokemonData = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);

      setPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };

  useEffect(() => {
    pokeFunc();
  }, [url]);

  return (
    <>
      <div className="cont">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand poke-nav" href="#">
            <img
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt=""
            />
            &nbsp; My Pokemon App
          </a>
        </nav>
        <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            <Card pokemon={pokeData} loading={loading}></Card>
          </Suspense>
          <div className="btn-div">
            <button
              type="button"
              disabled={disable}
              className="btn btn-func"
              onClick={() => {
                setPokeData([]);
                setUrl(prevUrl);
              }}
            >
              Previous
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-func"
              onClick={() => {
                setPokeData([]);
                setUrl(nextUrl);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
