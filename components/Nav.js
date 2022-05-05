import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// import { Link } from 'react-router-dom';

import logo from '../images/logo.png';
import NavDropdown from './NavDropdown';


import MenuIcon from '@mui/icons-material/Menu';
import { ClickAwayListener } from '@mui/material';


const Nav = () => {

    const [mobileToggled, setMobileToggled] = useState(false);
    const [navLinks, setNavLinks] = useState([]);

    useEffect(() => {
        axios.get("http://147.182.209.157/api/navs?populate=*")
        .then((res) => {
            const data = res.data.data;
            var newNavLinks = [];
            data.forEach(item => {
                newNavLinks.push(item.attributes);
            })
            setNavLinks(newNavLinks);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    const showMobileMenu = () => {
        setMobileToggled(!mobileToggled);
    }

    return(
        <div className="row">
            
            <nav>
                <span className="logo">
                    <Link href="/">
                        <Image src={logo} height={75} width={260} responsive="true"/>
                    </Link>
                    {/* <Link href="/">
                        <h3 style={{ color: 'white' }}>Classes & Events</h3>
                    </Link> */}
                </span>

                <div className="nav-bars">
                    <ul className="nav-items top">
                        <li><Link href="/foundation">Memorial Health Foundation</Link></li>
                        <li><Link href="/location">Locations</Link></li>
                        <li><Link href="">Pay Bill</Link></li>
                        <li><Link href="">Appointment</Link></li>
                        <li><Link href="">ER Wait</Link></li>
                        <li><Link href="">MyMemorial Chart</Link></li>
                    </ul>
                    
                    <div id="nav-underline" ></div>

                    <ul className="nav-items bottom">
                        {/* <li><Link href="/provider">Provider</Link></li>
                        <NavDropdown name="Join Our Team" link="/careers" items={careerItems} cards={career} viewAll="/careers" />
                        <NavDropdown name="Services" link="/service" items={serviceItems} cards={services} viewAll="/service" />
                        <NavDropdown name="Patient & Visitors" link="/patients" items={items} cards={cards} viewAll="/patients" />
                        <NavDropdown name="Community" link="/community" items={communityItems} cards={community} viewAll="/community"/>
                        <li><Link href="/about">About Us</Link></li> */}
                        {
                            navLinks.map((val, idx) => {
                                if(val.QueryFrom === null){
                                    return (
                                        <li><Link href={val.Link.to}>{val.Name}</Link></li>
                                    )
                                } else {
                                    return (
                                        <NavDropdown name={val.Name} link={val.Link.to} queryFrom={val.QueryFrom}/>
                                    )
                                }
                            })
                        }
                        <li>
                            
                        </li>
                        
                    </ul>
                </div>

                <div id="mobile-menu" onClick={showMobileMenu}><MenuIcon /></div>


                <div id="nav-mobile" style={{ display: (mobileToggled) ? 'flex'  : 'none', visibility: (mobileToggled) ? 'visible' : 'hidden' }}>
                    <ul>
                        <li onClick={showMobileMenu} ><Link href="/foundation">Memorial Health Foundation</Link></li>
                        <li onClick={showMobileMenu} ><Link href="/location">Locations</Link></li>
                        <li onClick={showMobileMenu} ><Link href="">Pay Bill</Link></li>
                        <li onClick={showMobileMenu} ><Link href="">Appointment</Link></li>
                        <li onClick={showMobileMenu} ><Link href="">ER Wait</Link></li>
                        <li onClick={showMobileMenu} ><Link href="">MyMemorial Chart</Link></li>
                    </ul>
                    
                    <div id="nav-underline" ></div>

                    <ul>
                        <li onClick={showMobileMenu} ><Link href="/provider">Provider</Link></li>
                        <li onClick={showMobileMenu} ><Link href="/careers">Join Our Team</Link></li>
                        <li onClick={showMobileMenu} ><Link href="/service">Services</Link></li>
                        <li onClick={showMobileMenu} ><Link href="/patients">Patients & Visitors</Link></li>
                        <li onClick={showMobileMenu} ><Link href="/community">Community</Link></li> 
                        {/* <NavDropdown name="Services" link="/service" items={serviceItems} cards={services} viewAll="/service" />
                        <NavDropdown name="Patient & Visitors" link="/patients" items={items} cards={cards} viewAll="/patients" />
                        <NavDropdown name="Community" link="/community" items={communityItems} cards={community} viewAll="/community"/> */}
                        {/* <li><Link to="/community">Community</Link></li> */}
                        {/* {/* <li onClick={showMobileMenu} ><Link to="/about">About Us</Link></li> */}
                        
                    </ul>
                </div>


            </nav>

        </div>
    );

}

export default Nav;