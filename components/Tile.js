import React, { useRef, useState } from 'react';
import { Button, Grid } from '@mui/material/';



const Bar = ({ event }) => {

    const eventContentRef = useRef();
    const tooltipRef = useRef();
    const eventRef = useRef();

    const [colors, _] = useState({
        'C': 'rgb(191, 242, 223)',
        'E': '#FB6D22',
        'S': '#DE2F00',
        'SG': '#3B89C7'
    });

    const types = {
        'C': 'Class',
        'E': 'Event',
        'S': 'Screening',
        'SG': 'Support Group'
    }


    const handleHover = () => {
        console.log("CLICK");
        eventContentRef.current.style.visibility = 'visible';
        tooltipRef.current.style.visibility = 'hidden';
    }

    const handleLeaveHover = () => {
        eventContentRef.current.style.visibility = 'hidden';
    }

    const handleToolTipHover = (e) => {
        console.log(e.target);
        const rect = eventRef.current.getBoundingClientRect();
        const x = `${rect.x + 121}px`;
        const y = `${rect.y}px`;
        tooltipRef.current.style.visibility = 'visible';
        tooltipRef.current.classList.toggle('slide');
        tooltipRef.current.style.left = x;
        tooltipRef.current.style.top = y;
    }

    const handleToolTipLeave = (e) => {
        tooltipRef.current.style.visibility = 'hidden';
    }

    return(
        <>
            <div className="event-content" ref={eventContentRef}>
                {event.where}
                <span className="button" onClick={handleLeaveHover}>Close</span>
            </div>
            <div className="event-tooltip" ref={tooltipRef} style={{ backgroundColor: colors[event.class_type] }}>
                    <div style={{ width: '100%', height: '100%', margin: 'auto', padding: '0.5rem', position: 'relative' }}>
                        {event.name}
                    </div>
                </div>
            <div className="event success" style={{ backgroundColor: colors[event.class_type] }} onClick={() => handleHover()} onMouseEnter={handleToolTipHover} onMouseLeave={handleToolTipLeave} ref={eventRef}>
                <span style={{ color: '#3a3a3a', margin: 'auto' }}>{types[event.class_type]}</span>
            </div>
        </>
    )
}

const Tile = ({dates}) => {
    return(
        <>
            <Grid container spacing={4}>
                <Grid item md={12}>
                    {
                        dates.map((val,  idx) => {
                            return(
                                <Bar event={val} key={idx} />
                            )
                        })
                    }
                </Grid>
                <Grid item md={12}>
                    
                </Grid>
            </Grid>
        </>
    );
}

export default Tile;