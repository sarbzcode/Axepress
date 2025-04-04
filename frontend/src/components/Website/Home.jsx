import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Events from '@components/Categories/Events';
import Notices from '@components/Categories/Notices';
import headerImage from '@assets/welcome-bg.jpg'
import '@styles/Home.css';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/events')
        .then(response => setEvents(response.data))
        .catch(error => console.error('Error fetching events:', error));

        axios.get('http://localhost:5000/api/notices')
        .then(response => setNotices(response.data))
        .catch(error => console.error('Error fetching notices:', error));
    }, []);

    return (
        <div className='home'>
            <header className='header'>
                <img src={headerImage} alt='Acadia from a drone pov' className='header-image'/>
            </header>
            <main>
                <h2 className='greeting'>Welcome to Axepress!</h2>
                <h3 className='show'>Find all the latest events and notices here!</h3>
                <Notices notices={notices} />
                <Events events={events} />
            </main>
        </div>
    );
};

export default Home;