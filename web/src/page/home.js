import React, { useState, useEffect } from 'react';
import { Link as LinkRoute } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MovieBar from '../components/MovieBar';
import Description from '../components/Description'
import RankSection from '../components/RankSection'
import axios from 'axios'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const movieTopRank = [
  {movie_id:1, movie_name:"The Shawshank Redemption", rating:9.2, imageURL:"https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg"},
  {movie_id:2, movie_name:"The Godfather", rating:9.1, imageURL:"https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY67_CR1,0,45,67_AL_.jpg"}, 
  {movie_id:3, movie_name:"The Dark Knight", rating:9.1, imageURL:"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UY67_CR0,0,45,67_AL_.jpg"}, 
  {movie_id:4, movie_name:"The Godfather: Part II", rating:9.0, imageURL:"https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY67_CR1,0,45,67_AL_.jpg"}, 
  {movie_id:5, movie_name:"12 Angry Men", rating:9.0, imageURL:"https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX45_CR0,0,45,67_AL_.jpg"}, 
  {movie_id:0, movie_name:"The Lord of the Rings: The Return of the King", rating:9.0, imageURL:"https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY67_CR0,0,45,67_AL_.jpg"}
]

const movieRecommend = [movieTopRank[0], movieTopRank[2], movieTopRank[1], movieTopRank[4], 
    movieTopRank[3], 
    movieTopRank[5]]


export default function Home(props) {
  const classes = useStyles();
  const [updateFlag, setUpdate] = useState(false)

  const movieRecommend = [movieTopRank[0], movieTopRank[2], movieTopRank[1], movieTopRank[4], 
      movieTopRank[3], 
      movieTopRank[5]]

  useEffect(() => {
    timeoutFetch()
    const intervel = setInterval(timeoutFetch, 10000)
    return () => clearInterval(intervel)
  })

  const timeoutFetch = () => {
    console.log('Fetch')
    axios.get("https://axh6ghu8zb.execute-api.ap-northeast-1.amazonaws.com/dev")
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          const index = movieTopRank.findIndex(item => item.movie_id == res.data[i].movie_id)
          if (index !== -1)
            movieTopRank[index].rating = res.data[i].total_ratings
        }
        movieTopRank.sort((a, b) => b.rating - a.rating)
        setUpdate(!updateFlag)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //setInterval(timeoutFetch, 10000)
  //timeoutFetch()
  //setInterval(() => {console.log(movieTopRank)}, 10000)

  return (
    <React.Fragment>
      <CssBaseline />
      <MovieBar title="Movie Rank" isWelcome={false} />
      <Description title="Movie Rank" />

      <RankSection movieTopRank={movieTopRank} />
      
      {/* Recommendation */}
      <MovieBar title="Movie Recommendation" isWelcome={false} />

      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {movieRecommend.map((card) => (
              <Grid item key={card.movie_id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.imageURL}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.movie_name}
                    </Typography>
                    <Typography>
                      
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      {card.rating}
                    </Button>
                    
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>



      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}