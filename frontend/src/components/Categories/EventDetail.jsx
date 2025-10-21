import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as ics from 'ics';
import '@styles/EventDetail.css';

const EventDetail = () => {
    const {id} = useParams(); // Get the event ID from the URL parameters
    const [event, setEvent] = useState(null); // State to store event details
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [showCalendarOptions, setShowCalendarOptions] = useState(false); // State to toggle calendar options visibility

    // Fetch event details based on event ID
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${id}`); // API request to fetch event
                setEvent(res.data); // Set the event data in state
                setLoading(false); // Set loading state to false after data is fetched
            } catch (error) {
                console.error('Error fetching event details:', error); // Log error if fetching fails
                setLoading(false);
            }
        };
        fetchEvent(); // Call the fetch function when component mounts
    }, [id]); // Re-fetch event details when the event ID changes

    // Function to generate the ICS file for the event
    const generateICSFile = () => {
        if (!event) return; // Exit if event data is not available
        const { title, description, place, date, time } = event;
      
        // Validate date and time format explicitly
        try {
            const isoDate = new Date(date); // Convert event date to Date object
            const localYear = isoDate.getFullYear();
            const localMonth = isoDate.getMonth() + 1; // ICS uses 1-based month
            const localDay = isoDate.getDate();
        
            // Parse time string "18:00:00" into hours/minutes
            const [hours, minutes] = time.split(":").map(Number).slice(0, 2);
        
            // Create combined datetime (in LOCAL timezone)
            const eventDate = new Date(
              localYear,
              localMonth - 1, // JS uses 0-based month
              localDay,
              hours,
              minutes
            );
        
            // Validate the final datetime
            if (isNaN(eventDate.getTime())) {
              throw new Error("Invalid combined date/time");
            }

            // Prepare event details for ICS format
            const eventDetails = {
                title: title || "Untitled Event",
                description: description || "",
                location: place || "",
                start: [
                    eventDate.getFullYear(),
                    eventDate.getMonth() + 1, // ICS expects 1-based month
                    eventDate.getDate(),
                    eventDate.getHours(),
                    eventDate.getMinutes(),
                ],
                duration: { hours: 1 }, // Default duration set to 1 hour
            };

            // Generate ICS file
            const { error, value } = ics.createEvent(eventDetails);
            if (error) {
                console.error("ICS Error:", error); // Log ICS generation errors
                return;
            }

            // Trigger download of the ICS file
            const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${title.replace(/\s+/g, "_")}.ics`; // Download file with formatted title
            link.click(); // Simulate click to trigger download

        } catch (error) {
            console.error("ICS Generation Failed:", error); // Log any other errors
            // Optionally, show user-facing error message (e.g., toast notification)
        }
    };

    // Handle adding to Apple Calendar
    const handleAppleCalendar = () => {
        generateICSFile(); // Generate and download ICS file for Apple Calendar
    };

    // Handle adding to Outlook Calendar
    const handleOutlookCalendar = () => {
        generateICSFile(); // Generate and download ICS file for Outlook Calendar
    };

    // Toggle the display of calendar options
    const handleAddToCalendarClick = () => {
        setShowCalendarOptions(!showCalendarOptions); // Toggle the state to show/hide options
    };

    // Format the date and time to a human-readable format
    const formatDateTime = (isoDate, timeString) => {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();

        const [hours, minutes] = timeString.split(":").map(Number);
        const localDate = new Date(year, month, day, hours, minutes);

        // Format date and time to display
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        return {
            date: localDate.toLocaleDateString('en-US', dateOptions),
            time: localDate.toLocaleTimeString('en-US', timeOptions)
        };
    };

    return (
        <div className='event-detail'>
            {loading ? (
                <p className='loading'>Loading...</p> // Show loading message while event data is being fetched
            ) : event ? (
                <div>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p><strong>Location: </strong>{event.place}</p>
                    {/* Only display date and time if they exist */}
                    {event.date && event.time && (
                        <>
                            <p><strong>Date: </strong>{formatDateTime(event.date, event.time).date}</p>
                            <p><strong>Time: </strong>{formatDateTime(event.date, event.time).time}</p>
                        </>
                    )}
                    {/* Button to toggle calendar options */}
                    <button className="add-to-calendar-btn" onClick={handleAddToCalendarClick}>Add to Calendar</button>
                    {/* Display calendar options if shown */}
                    {showCalendarOptions && (
                        <div className='calendar-options'>
                            <button className="calendar-btn" onClick={handleAppleCalendar}>Apple Calendar</button>
                            <button className="calendar-btn" onClick={handleOutlookCalendar}>Outlook Calendar</button>
                        </div>
                    )}
                </div>
            ) : (
                <p className='error'>Event not found!</p> // Show error message if event is not found
            )}
        </div>
    );
};

export default EventDetail;
