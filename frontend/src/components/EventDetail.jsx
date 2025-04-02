import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as ics from 'ics';
import '../styles/EventDetail.css';

const EventDetail = () => {
    const {id} = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCalendarOptions, setShowCalendarOptions] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const generateICSFile = () => {
        if (!event) return;
        const { title, description, place, date, time } = event;
      
        // Validate date and time format explicitly
        try {
            const isoDate = new Date(date);
            const localYear = isoDate.getFullYear();
            const localMonth = isoDate.getMonth() + 1; // ICS uses 1-based month
            const localDay = isoDate.getDate();
        
            // 2. Parse time string "18:00:00" into hours/minutes
            const [hours, minutes] = time.split(":").map(Number).slice(0, 2);
        
            // 3. Create combined datetime (in LOCAL timezone)
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
              duration: { hours: 1 },
          };
          
      
          // Generate ICS (using array destructuring)
          // ✅ CORRECT FOR v3.x
        const { error, value } = ics.createEvent(eventDetails);
          if (error) {
            console.error("ICS Error:", error);
            return;
          }
      
          // Download file
          const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${title.replace(/\s+/g, "_")}.ics`;
          link.click();
      
        } catch (error) {
          console.error("ICS Generation Failed:", error);
          // Add user-facing error message here (e.g., toast notification)
        }
    };

    const handleAppleCalendar = () => {
        generateICSFile();
    };

    const handleOutlookCalendar = () => {
        generateICSFile();
    };

    const handleAddToCalendarClick = () => {
        setShowCalendarOptions(!showCalendarOptions);
    }

    const formatDateTime = (isoDate, timeString) => {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();

        const [hours, minutes] = timeString.split(":").map(Number);
        const localDate = new Date(year, month, day, hours, minutes);

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
                <p>Loading...</p>
            ) : event ? (
                <div>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p><strong>Location: </strong>{event.place}</p>
                    {event.date && event.time && (
                        <>
                        <p><strong>Date: </strong>{formatDateTime(event.date, event.time).date}</p>
                        <p><strong>Time: </strong>{formatDateTime(event.date, event.time).time}</p>
                        </>
                    )}
                    <button onClick={handleAddToCalendarClick}>Add to Calendar</button>
                    {showCalendarOptions && (
                        <div className='calendar-options'>
                            <button onClick={handleAppleCalendar}>Apple Calendar</button>
                            <button onClick={handleOutlookCalendar}>Outlook Calendar</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Event not found!</p>
            )}
        </div>
    );
};
    export default EventDetail;