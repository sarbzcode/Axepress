import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@styles/NoticeDetail.css';

const NoticeDetail = () => {
    // Extract the notice ID from the URL params
    const { id } = useParams();
    
    // State to store the fetched notice details
    const [notice, setNotice] = useState(null);
    
    // State to track the loading status while the notice is being fetched
    const [loading, setLoading] = useState(true);

    // useEffect hook to fetch notice details when the component mounts
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                // Fetch notice details using the notice ID from the URL
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/${id}`);
                setNotice(res.data); // Set the fetched notice data in state
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching notice details:', error); // Log any errors
                setLoading(false); // Set loading to false if there's an error
            }
        };

        fetchNotice(); // Call the function to fetch the notice
    }, [id]); // Dependency array ensures this effect runs whenever the `id` changes

    return (
        <div className='notice-detail'>
            {loading ? (
                // Show loading text while the notice is being fetched
                <p className='loading'>Loading...</p>
            ) : notice ? (
                // Once data is fetched, display the notice details
                <div>
                    <h2>{notice.title}</h2>
                    <p>{notice.description}</p>
                </div>
            ) : (
                // If no notice is found, display an error message
                <p className='error'>Notice not found.</p>
            )}
        </div>
    );
}

export default NoticeDetail;
