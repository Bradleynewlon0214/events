import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from '../components/Nav'
import { Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material'
import { Box } from '@mui/system';
import { getAllEvents } from '../lib/events';
import { Calendar } from 'react-calendar';
import Tile from '../components/Tile';
import icon from '../images/icon.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SecondNav from '../components/SecondNav';
// import { DateTimePicker, LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';



function isSameDay(d1, d2) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const groupDates = (dates) => {
  var groups = {};
  for(var i = 0; i < dates.length; i++){
    const item = dates[i].start_date;
    groups[item] = [];
  }
  for(var i = 0; i < dates.length; i++){
    const item = dates[i];
    groups[item.start_date].push(item);
  }
  return groups;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('/') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
    ].join(':')
  );
}


// export async function getStaticProps() {
//   return {
//     props: {
//       events: getAllEvents()
//     }
//   }
// }

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState({});
  const [backupEvents, setBackupEvents] = useState([]);
  const [comEvents, setComEvents] = useState([]);
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [colors, _] = useState({
    'C': '#5EB794',
    'E': '#FB6D22',
    'S': '#DE2F00',
    'SG': '#3B89C7'
  });

  const [date, setDate] = useState(new Date());
  const [costFilter, setCostFilter] = useState('Default');
  const [whereFilter, setWhereFilter] = useState('Default');
  const [isMobile, setIsMobile] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [queryUrl, setQueryUrl] = useState('http://localhost:8000/api/classes');

  const tileContent = useCallback(({ date, view }) => {
    const groups = groupDates(comEvents);
    console.log(groups);
    console.log("groups ^");
    const dateGroups = Object.keys(groups);
    var count = 0;

    if(view === 'month'){
      for(var i = 0; i < dateGroups.length; i++){
        const item = dateGroups[i];
        if(isSameDay(item, date)){
          count++;
          if(count < 4){
            return <Tile dates={groups[item]} />;
          }
        }
      }
    }
  });

  const CustomText = forwardRef(({ value, onClick }, ref) => (
    <FormControl fullWidth>
      <TextField onClick={onClick} ref={ref} value={value} variant="outlined" label="Date" />
    </FormControl>
  ));
  CustomText.displayName = "CustomText";

  useEffect(() => {
    if(comEvents){
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(window.innerWidth < 1024){
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    fetch(queryUrl)
    .then(res =>  res.json())
    .then(data => {
      console.log(data.results);
      setComEvents(data.results);
      setBackupEvents(data.results);
      setNext(data.next);
      setPrev(data.previous);
    })
  }, [queryUrl]);

  const handlePrev = () => {
    setPage((p) => p - 1);
    setQueryUrl(prev);
  }

  const handleNext = () => {
    setPage((p) => p + 1);
    setQueryUrl(next);
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    filter(category, whereFilter, costFilter, start, end);
  }

  const handleCategoryChange = (cat) => {
    if(cat === category) {
      setComEvents(backupEvents);
      setCategory(null);
    } else {
      // var newEvents = backupEvents.filter(item => item.type === cat);
      // setComEvents(newEvents);
      filter(cat, whereFilter, costFilter, startDate, endDate);
      setCategory(cat);
    }
  }

  const handleCostFilter = (e) => {
    setCostFilter(e.target.value);
    filter(category, whereFilter, e.target.value, startDate, endDate);
  }

  const handleWhereFilter = (e) => {
    setWhereFilter(e.target.value);
    filter(category, e.target.value, costFilter, startDate, endDate);
  }

  const filter = (cat, where, cost, start, end) => {
    var newEvents = backupEvents;
    const ascending = (a, b) => a.cost - b.cost;
    const descending = (a, b) => b.cost - a.cost;
    if(cat !== null){
      newEvents = backupEvents.filter(item => item.type === cat);
    }
    if(where !== 'Default'){
      newEvents = newEvents.filter(item => item.where === where);
    }
    if(cost !== 'Default') {
      if(cost === 'descending') {
        console.log(cost);
        newEvents.sort(ascending);
      }
      if(cost === 'ascending'){
        console.log(cost);
        newEvents.sort(descending);
      }
    }
    if(startDate != null && end !== null){
      newEvents = newEvents.filter(item => item.start >= start && item.end <= end);
    }
    setComEvents(newEvents);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Classes and Events</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <SecondNav />

      {
        (isMobile) ?
          <></>
        :
        <>
          <Grid container className="row-container">
            <Grid item md={12}>
              <div className="bar info"></div>
                <h1>Event Calendar</h1>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="row-container" sx={{ height: '75rem' }}>
              <Grid item md={3}>
                <Grid container>
                  <Grid item md={12}>
                    {/* <div className="card success tab" style={{ margin: '0.1rem auto', width: '80%', height: '14.7rem', color: '#3a3a3a', textAlign: 'center', paddingTop: '5rem'}} onClick={() => handleCategoryChange('Classes')}>
                      <h1 style={{ color: 'white', }}>Classes</h1>
                    </div> */}
                    <div className="tab" style={{ margin: '0rem auto', width: '80%', height: '14.7rem', color: '#3a3a3a', textAlign: 'center'}} onClick={() => handleCategoryChange('C')}>
                      <Image src={icon} height={170} width={170} responsive="true"/>
                      <h1 style={{ marginTop: '-1rem' }}>Classes</h1>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <div className="card warning tab" style={{ margin: '0.25rem auto', width: '80%', height: '14.7rem', color: '#3a3a3a', textAlign: 'center', paddingTop: '5rem'}} onClick={() => handleCategoryChange('E')}>
                      <h1 style={{ color: 'white', }}>Events</h1>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <div className="card error tab" style={{ margin: '0.25rem auto', width: '80%', height: '14.7rem', color: '#3a3a3a', textAlign: 'center', paddingTop: '5rem'}} onClick={() => handleCategoryChange('S')}>
                      <h1 style={{ color: 'white', }}>Screenings</h1>
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    <div className="card info tab" style={{ margin: '0.25rem auto', width: '80%', height: '14.7rem', color: '#3a3a3a', textAlign: 'center', paddingTop: '4rem'}} onClick={() => handleCategoryChange('SG')}>
                      <h1 style={{ color: 'white', }}>Support Groups</h1>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={9}>
                <div style={{ width: '100%', height: '60rem' }}>
                  <Calendar onChange={handleDateChange} value={date} tileContent={tileContent} />
                </div>
              </Grid>
          </Grid>
          </>
      }



      <Modal 
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "50rem",
            bgcolor: 'white',
            border: 'none',
            boxShadow: 24,
            p: 4,
        }}>
          <Grid container spacing={4}>
            <Grid item md={12}>
              <h4>{active.name}</h4>
            </Grid>
            <Grid item md={7}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos optio animi consequatur, ullam asperiores accusantium ipsa sunt et vitae laudantium rerum, harum pariatur nostrum ad.</Grid>
            <Grid item md={5}>
              <h5>Where: {active.where}</h5>
              <h5>Cost: {active.cost}</h5>
              <h5>Registrants: {active.registrants} / {active.max}</h5>
            </Grid>
            <Grid item md={12}>
              <Button variant="contained">Register</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Grid container spacing={2} className="row-container">
        <Grid item md={8}>
          <h4>All {category}</h4>
          {
            (!loading) ? 
              comEvents.map((val, idx) => (
                <div className="card gray" style={{ marginLeft: 0, width: '100%', height: '16.5rem', padding: '1.5rem' }} key={idx}>
                  <Grid container sx={{ width: '100%', height: '100%' }}>
                    <Grid item md={12}>
                      <Grid container>
                        <Grid item md={12}>
                          <div className="card-title" style={{ color: "#3a3a3a", margin: '0rem 0rem' }}>
                            <h4 style={{ marginBottom: '0.25rem' }}>
                              <Link href={`/event/${val.class_id}`}>
                                <span className={styles.link} style={{ color: colors[val.class_type] }}>{val.name}</span>
                              </Link>
                            </h4>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={12}>
                      <Grid container>
                        <Grid item md={2} sx={{ color: '#3a3a3a', width: '100%', height: '100%' }}>
                          <div className="box" style={{ width: '100%', height: '50%', backgroundColor: colors[val.class_type], color: 'white', padding: '2rem', textAlign: 'center' }} >
                            <h4>Apr</h4>
                            <h2 style={{ marginBottom: 0 }}>8</h2>
                          </div>
                        </Grid>
                        <Grid item md={10}>
                          
                          <div className="card-content" style={{ color: '#3a3a3a' }}>
                            <Grid container spacing={2}>
                              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', margin: '1rem 0.4rem'}}>
                                <div style={{ width: '70%', padding: '0rem 0.5rem' }}>
                                  <div style={{ width: '100%' }}>
                                    {`${val.description.substring(0, 201)}`}
                                  </div>
                                  <div style={{ width: '100%', marginTop: '4.25rem' }}>
                                    <Link href={`/event/${val.class_id}`}>
                                      <span className={styles.link} style={{ color: colors[val.class_type] }}>Read More...</span>
                                    </Link>
                                  </div>
                                </div>
                                <div style={{ width: '30%', textAlign: 'end', borderLeft: '1px solid black', paddingLeft: '0.5rem' }}>
                                  <h5 style={{ marginBottom: '0.3rem', width: '100%' }}>Where: {val.location.name}</h5>
                                  <h5 style={{ marginBottom: '0.3rem', width: '100%' }}>When: {formatDate(new Date(val.start_date))}</h5>
                                  <h5 style={{ marginBottom: '0.3rem', width: '100%' }}>Cost: {val.cost}</h5>
                                  <h5 style={{ marginBottom: '0.3rem', width: '100%' }}>Registrants: {val.registrants_count} / {val.participation_limit}</h5>
                                </div>
                              </div>
                            </Grid>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              ))
            :
              null
          }
        </Grid>
        <Grid item md={4}>
          <h4>Filter</h4>
          <div className="box" style={{ width: '100%', height: '16rem', padding: '2rem' }}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel>Cost</InputLabel>
                  <Select label="Cost" value={costFilter} onChange={(e) => handleCostFilter(e)}>
                    <MenuItem value="Default">Default</MenuItem>
                    <MenuItem value="descending">Cost Descending</MenuItem>
                    <MenuItem value="ascending">Cost Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel>Where</InputLabel>
                  <Select label="Where" value={whereFilter} onChange={(e) => handleWhereFilter(e)}>
                    <MenuItem value="Default">Default</MenuItem>
                    <MenuItem value="Marietta">Marietta</MenuItem>
                    <MenuItem value="Belpre">Belpre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    customInput={<CustomText />}
                    selectsRange
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} className="row-container">
        <Grid item md={8}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handlePrev}>Prev</button>
            <button>Page: {page}</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}




