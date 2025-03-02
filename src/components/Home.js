import styled from "styled-components";
import ImgSlider from "./ImgSlider";
import NewDisney from "./NewDisney";
import Originals from "./Originals";
import Recommends from "./Recommends";
import Trending from "./Trending";
import Viewers from "./Viewers";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { setMovies } from "../features/movie/movieSlice";
import { selectUserName } from "../features/user/userSlice";

const Home = (props) => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  const [movies, setMoviesState] = useState({
    recommend: [],
    newDisney: [],
    original: [],
    trending: [],
  });

  const fetchMovies = useCallback(() => {
    db.collection("movies").onSnapshot((snapshot) => {
      const recommendList = [];
      const newDisneyList = [];
      const originalList = [];
      const trendingList = [];

      snapshot.docs.forEach((doc) => {
        const movieData = { id: doc.id, ...doc.data() };

        switch (movieData.type) {
          case "recommend":
            recommendList.push(movieData);
            break;
          case "new":
            newDisneyList.push(movieData);
            break;
          case "original":
            originalList.push(movieData);
            break;
          case "trending":
            trendingList.push(movieData);
            break;
          default:
            break;
        }
      });

      setMoviesState({
        recommend: recommendList,
        newDisney: newDisneyList,
        original: originalList,
        trending: trendingList,
      });

      dispatch(
        setMovies({
          recommend: recommendList,
          newDisney: newDisneyList,
          original: originalList,
          trending: trendingList,
        })
      );
    });
  }, [dispatch]);

  useEffect(() => {
    if (userName) {
      fetchMovies();
    }
  }, [userName, fetchMovies]);

  return (
    <Container>
      <ImgSlider />
      <Viewers />
      <Recommends />
      <NewDisney />
      <Originals />
      <Trending />
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

export default Home;
