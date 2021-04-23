import {
    Card,
    CardContent, Grid
  } from '@material-ui/core/';
  import Button from '@material-ui/core/Button';
  import CardActions from '@material-ui/core/CardActions';
  import Typography from '@material-ui/core/Typography';
  import React from 'react';
  import { Spinner } from 'react-bootstrap';
  import { makeStyles } from '@material-ui/core/styles';
  import { Container } from 'react-bootstrap'
  import NFTCard from '../../../../components/Cards/NFTCard';
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    badge: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    card: {
      minWidth: 250,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }));
  
  function DigitalArt() {
    const classes = useStyles();
  
    return (
  
      <>
  
        <div className="container-fluid">
          {/* <!-- Page Header --> */}
          <div className="page-header">
            <Container>
              <h3><pre>Market Place</pre></h3>
              <hr></hr>
              <div className={classes.card}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                // alignItems="flex-start"
                >
                  <NFTCard />
                  <NFTCard />
                  <NFTCard />
                  <NFTCard />
  
                </Grid>
  
                {/* </Grid> */}
              </div>
            </Container>
  
          </div>
        </div >
  
      </>
    );
  }
  
  export default DigitalArt;
  