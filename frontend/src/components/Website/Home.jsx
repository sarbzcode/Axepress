import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Events from '@components/Categories/Events'; // Import Events component
import Notices from '@components/Categories/Notices'; // Import Notices component
import headerImage from '@assets/welcome-bg.jpg'; // Import background image for header
import '@styles/Home.css'; // Import styles for the home page

const Home = () => {
    const [events, setEvents] = useState([]); // State for storing events data
    const [notices, setNotices] = useState([]); // State for storing notices data

    useEffect(() => {
        // Fetch events data from the server
        axios.get('http://localhost:5000/api/events')
        .then(response => setEvents(response.data)) // Set events data to state
        .catch(error => console.error('Error fetching events:', error)); // Error handling for events

        // Fetch notices data from the server
        axios.get('http://localhost:5000/api/notices')
        .then(response => setNotices(response.data)) // Set notices data to state
        .catch(error => console.error('Error fetching notices:', error)); // Error handling for notices
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    return (
        <div className='home'>
            <header className='header'>
                {/* Header section with background image */}
                <img src={headerImage} alt='Acadia from a drone pov' className='header-image' />
            </header>
            <main>
                {/* Main content section */}
                <h2 className='greeting'>Welcome to Axepress!</h2>
                <h3 className='show'>Find all the latest events and notices here!</h3>

                {/* Render Notices and Events components with respective data */}
                <Notices notices={notices} />
                <Events events={events} />
            </main>
        </div>
    );
};

export default Home;