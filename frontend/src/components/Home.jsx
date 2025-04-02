import React, {useState, useEffect} from 'react';
import { getNotices } from '../services/noticeService';
import {getEvents} from '../services/eventService';
import '../styles/Home.css';

const Home = () => {
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const noticesData = await getNotices();
                console.log("Fetched Notices:", noticesData);
                const eventsData = await getEvents();
                console.log("Events fetched on Home Page:", eventsData);
                setNotices(noticesData);
                setEvents(eventsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notices and events:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (
        <div className='home-container'>
            <h2>Welcome to AxeConnect!</h2>
            <p>Find the latest updates and events happening on campus.</p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='cards-container'>
                    <div className='cards-section'>
                        <h3>Recent Notices</h3>
                        <div className='cards'>
                            {notices.map((notice) => (
                                <div key={notice.id} className='card'>
                                    <h4>{notice.title}</h4>
                                    <p>{notice.description}</p>
                                    <a href={`/notices/${notice.id}`} className='card-link'>View Details</a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='cards-section'> 
                        <h3>Upcoming Events</h3>
                        <div className='cards'>
                            {events.map((event) => (
                                <div key={event.id} className='card'>
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                    <a href={`/events/${event.id}`} className="card-link">View Details</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;