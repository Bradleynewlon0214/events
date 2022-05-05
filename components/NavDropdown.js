import React, { useState, useEffect } from "react";
import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
import Link from 'next/link';
import useRouter from 'next/router';
import { Card, CardActions, CardContent, CardMedia, ClickAwayListener, Grid, listItemSecondaryActionClasses, Skeleton, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { queryFromSwitch } from "./utils";


const NavDropdown = ({name, link, queryFrom}) => {
    
    const MAX_ITEMS = 15;
    const MAX_CARDS = 3;
    const [loading, setLoading] = useState(true);
    const [hidden, setHidden] = useState(true);
    const [items, setItems] = useState([1, 2]);
    const [cards, setCards] = useState([{}, {}]);

    useEffect(() => {
        setLoading(true);
        if(queryFrom){
            axios.get(`http://147.182.209.157${queryFromSwitch(queryFrom)}?populate=*`)
            .then((res) => {
                const data = res.data.data;
                var itemsData = [];
                var cardsData = [];
                data.forEach(item => {
                    if(itemsData.length < MAX_ITEMS){
                        itemsData.push({ name: item.attributes.Name, slug: `${queryFrom}/${item.attributes.Slug}` });
                    }
                    if(cardsData.length < MAX_CARDS){
                        cardsData.push({
                            title: item.attributes.Name,
                            img: `http://147.182.209.157${item.attributes.Card.data.attributes.url}`,
                            content: item.attributes.About,
                            link: `${link}/${item.attributes.Slug}`
                        });
                    }
                    itemsData.sort((a, b) => {
                        if(a.name < b.name) return -1;
                        if(a.name > b.name) return 1;
                    });
                    setItems(itemsData);
                    setCards(cardsData);
                    setLoading(false);
                })
                
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [queryFrom])


    const showNav = (e) => {
        e.preventDefault();
        setHidden(!hidden);
    } 

    const handleClickAway = () => {
        setHidden(true);
    }

    // const router = useRouter();
    const router = {
        push: () => {}
    }


    if(loading){
        return(
            <li><Skeleton variant="text" /></li>
        )
    } else {
        return(
            <ClickAwayListener onClickAway={handleClickAway}>
                <li>
                    {
                        (window.innerWidth < 1024) ?
                            <Link to={link}>{name}</Link>
                        :
                            <div onClick={showNav} style={{ height:'100%', width: '100%', display: 'flex', color: 'white'}}>{name}<ArrowDropDownIcon sx={{ pb: '5px' }} /></div>
                    }
                    <div 
                        style={{ 
                            position: 'absolute', 
                            display: 'flex',
                            flexDirection: 'row', 
                            width: '100%', 
                            height: '70%', 
                            backgroundColor: 'white', 
                            left: 0, 
                            top: '9rem',
                            visibility: (hidden) ? 'hidden' : 'visible',
                            zIndex: 100,
                            boxShadow: '0 5180px 45vh 5000px #cccc',
                            // boxShadow: '0px 75px 30px 9px rgba(50, 50, 50, 0.75)' 
                        }}
                    >
                        <Grid container className="row-container">
                            <Grid item md={4}>
                                <div className="items" style={{ marginLeft: '15%', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', rowGap: '1rem', alignContent: 'center', justifyContent: 'center', height: '95%' }}>
                                    {
                                        items.map((val, idx) => {
                                            if(idx < 8){
                                                return(
                                                    <div className="item">
                                                        <Link onClick={() => setHidden(true)} href={val.slug} style={{ color: "#3A3A3A" }}>{val.name}</Link>
                                                    </div>
                                                )
                                            }

                                        })
                                    }
                                    <div className="item" style={{ marginTop: 'auto', color: "#3A3A3A" }}>
                                        <Link onClick={() => setHidden(true)} style={{ color: "#3A3A3A" }} href={link}>View All</Link>
                                    </div>
                                </div>

                            </Grid>
                            <Grid item md={8}>
                                <Grid container>
                                    {
                                        cards.map((val, idx) => (
                                            <Grid item md={4} key={idx} style={{ display: 'flex', columnGap: '1rem' }}>
                                                <div className="card card-white"  onClick={() => {setHidden(true); router.push(val.link)}}>
                                                    <img src={val.img} alt={val.name} />
                                                    <div className="card-title" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                        {val.title}
                                                    </div>
                                                </div>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        
                        </Grid>
                    </div>
                </li>
            </ClickAwayListener>
        );
    }
}

export default NavDropdown;