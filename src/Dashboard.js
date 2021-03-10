import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import "react-datepicker/dist/react-datepicker.css";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { CSVLink } from "react-csv";
import CircularProgress from '@material-ui/core/CircularProgress';

const axios = require('axios');


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

const indexs = ["FMCG", "ENERGY"]
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const [showProgress, setShowProgress] = useState(false)
  const csvLink = useRef()
  const classes = useStyles();
  var date = new Date();
  date.setDate(date.getDate() - 1);
  const [selectedDate, setSelectedDate] = useState(date);
  const [index, setIndex] = useState();
  const [csvResponse, setCsvResponse] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  function handleIndexChange(e) {
    const indexName = e.target.value
    import('./IndexData/' + indexName).then((data) => {
      setIndexData(data.default);
    });
    setIndex(indexName)
  }
  const [exchange, setExchange] = React.useState('nse');
  function getDateInFormat() {
    return selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).replace(/ /g, '-')
  }
  const handleRadioChange = (event) => {
    setExchange(event.target.value);
  };
  function handleTextChange(e) {
    setIndexData(e.target.value)
  }
  function handleDownloadClick() {
    setShowProgress(true)
    axios({
      method: 'post',
      url: 'http://localhost:8080/getbhavcopy',
      data: {
        "NSE50": indexData
      }
    }).then(function (response) {
      setCsvResponse(response.data);
      csvLink.current.link.click();
      setShowProgress(false)
    }).catch(function (error) {
      console.log(error);
      setShowProgress(false)
    })
  }
  const fileName = getDateInFormat();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={1} style={{ margin: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={3} style={{ alignSelf: "center" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Stock Exchange</FormLabel>
                <RadioGroup aria-label="exchange" name="exchange" value={exchange} onChange={handleRadioChange}>
                  <div>
                    <FormControlLabel value="nse" control={<Radio />} label="NSE" />
                    <FormControlLabel value="bse" control={<Radio />} label="BSE" />
                  </div>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{ alignSelf: "center" }}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Select Index</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={index}
                  onChange={handleIndexChange}
                  label="Select Indices"
                  style={{ width: "250px" }}
                >
                  {indexs.map((index) => {
                    return (<MenuItem value={index + ".json"}>{index}</MenuItem>)
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{ alignSelf: "center" }}>
              <FormControl variant="outlined" className={classes.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date picker inline"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{ alignSelf: "center" }}>
              <Button variant="contained" color="primary" onClick={handleDownloadClick}>
                Download
              </Button>
              {showProgress ? <CircularProgress /> : <div />}
              <CSVLink
                data={csvResponse}
                filename={index ? index.split(".")[0] + "-" + getDateInFormat() + ".csv" : fileName + ".csv"}
                className="hidden"
                ref={csvLink}
                target="_blank" />
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ padding: "20px" }}>
          <TextareaAutosize style={{ width: "100%", height: "360px" }} aria-label="maximum height"
            value={indexData}
            onChange={handleTextChange}
            placeholder="" />
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
