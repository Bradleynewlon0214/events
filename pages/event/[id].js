import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Nav from '../../components/Nav';
import { Avatar, Grid, LinearProgress, Skeleton, TextField } from '@mui/material';

import { getAllEventIds, getAllEvents } from '../../lib/events';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// import { DateTimePicker, LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';


// export async function getStaticPaths(){
//     const paths = getAllEventIds();
//     return {
//         paths,
//         fallback: false
//     }
// }

// export async function getStaticProps() {
//     return {
//       props: {
//         events: getAllEvents()
//       }
//     }
//   }

//   { events }

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


const Events = () => {

    const router = useRouter()
    const { id } = router.query
    
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [errors, setErrors] = useState(null);
    const [colors, _] = useState({
        'C': '#5EB794',
        'E': '#FB6D22',
        'S': '#DE2F00',
        'SG': '#3B89C7'
      });

    useEffect(() => {
        fetch(`https://recipeze.net/api/classes/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setEvent(data);
            setLoading(false);
        })
        // setEvent(events[id]);
    }, []);

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            setSuccessful(true);
            // setSubmitted(false);
        }, [5000])
    }

    if(!loading){
        return(
            <>
                <Nav />
    
                <Grid container spacing={4} className="row-container">
                    <Grid item md={12}>
                        <div className="bar success" style={{ backgroundColor: colors[event.class_type] }}></div>
                        <h1>{event.name}</h1>
                        <p>
                            {event.description}
                        </p>
                    </Grid>
                </Grid>
                <Grid container spacing={4} className="row-container gray">
                    <Grid item md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: '6rem', height: '6rem', bgcolor: colors[event.class_type], mb: '1rem' }}
                        >
                            <CalendarMonthIcon sx={{ width: '4rem', height: '4rem',}} />
                        </Avatar>
                        <h5 style={{ textAlign: 'center' }}>When: <br /> {formatDate(new Date(event.start_date))} - {formatDate(new Date(event.end_date))}</h5>
                    </Grid>
                    <Grid item md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: '6rem', height: '6rem', bgcolor: colors[event.class_type], mb: '1rem' }}
                        >
                            <LocationOnIcon sx={{ width: '4rem', height: '4rem',}} />
                        </Avatar>
                        <h5 style={{ textAlign: 'center' }}>Where: {event.location.name}</h5>
                    </Grid>
                    <Grid item md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: '6rem', height: '6rem', bgcolor: colors[event.class_type], mb: '1rem' }}
                        >
                            <PriceCheckIcon sx={{ width: '4rem', height: '4rem',}} />
                        </Avatar>
                        <h5 style={{ textAlign: 'center' }}>Cost: {event.cost}</h5>
                    </Grid>
                    <Grid item md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: '6rem', height: '6rem', bgcolor: colors[event.class_type], mb: '1rem' }}
                        >
                            <PeopleIcon sx={{ width: '4rem', height: '4rem',}} />
                        </Avatar>
                        <h5 style={{ textAlign: 'center' }}>Registrants: {event.registrants_count} / {event.participation_limit}</h5>
                    </Grid>
                </Grid>
                {
                (submitted) ?
                    <div>
                        <Grid container spacing={4} className="row-container">
                            {
                                (successful) ?
                                    <Grid item md={12}>
                                        <div className="bar-thin info"></div>
                                        <h4>Registration successful</h4>
                                        <p>A confirmation will be emailed to you shortly as well as any additional details you may need</p>
                                    </Grid>
                                :
                                    <Grid item md={12}>
                                        <LinearProgress sx={{ width: '18rem', mb: '2%' }} />
                                        <h4>Processing</h4>
                                        <p>We are processing your request please wait</p>
                                    </Grid>
                            }
                        </Grid>
                    </div>
                :
                    <div>
                        <Grid container spacing={4} className="row-container">
                            <Grid item md={12}>
                                <div className="bar-thin info"></div>
                                <h4>Registration</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="row-container">
                            <Grid item md={5}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="First Name" />
                            </Grid>
                            <Grid item md={5}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Last Name" />
                            </Grid>
                            <Grid item md={2}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Middle Initial" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Phone" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Email" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Date of Birth" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="row-container">
                            <Grid item md={8}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Street Address" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="APT/Suite Number" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="City" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="State" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="ZIP" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="row-container">
                            <Grid item md={12}>
                                <h4>Billing</h4>
                            </Grid>
                            <Grid item md={6}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Name on Card" />
                            </Grid>
                            <Grid item md={6}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Billing Address" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="City" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="State" />
                            </Grid>
                            <Grid item md={4}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="ZIP" />
                            </Grid>
                            <Grid item md={8}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Card Number" />
                            </Grid>
                            <Grid item md={2}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="Card Expiration" />
                            </Grid>
                            <Grid item md={2}>
                                <TextField sx={{ width: '99%' }} variant="standard" label="CVV" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className="row-container">
                            <Grid item md={12} sx={{ textAlign: 'center' }}>
                                <button className="button-info" style={{ width: '60%' }} onClick={handleSubmit}>Register</button>
                            </Grid>
                        </Grid>
                    </div>
                } 
            </>
        );
    } else {
        return (
            <>
                <Nav />
                <Grid container spacing={4}>
                    <Grid item md={4}>
                        <Skeleton variant="rectangular"/>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default Events;