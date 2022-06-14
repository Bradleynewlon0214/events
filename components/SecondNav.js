import React from 'react';
import Link from 'next/link';


const SecondNav = () => {
    return(
        <div style={{ width: '100%', backgroundColor: 'whitesmoke', display: 'flex', textAlign: 'end', paddingRight: '2rem', paddingLeft: '2rem' }}>
            <ul style={{ listStyle: 'none', display: 'inline', textDecoration: 'none', width: '100%' }}>
                <li>
                    <Link href="/submit">
                        Submit a new Class/Event
                    </Link>
                </li>
                <li>
                    <Link href="/register">
                        Sign Up
                    </Link>
                </li>

            </ul>
        </div>
    );
}

export default SecondNav;