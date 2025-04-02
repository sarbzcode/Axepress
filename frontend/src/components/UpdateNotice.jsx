import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateNotice = ({ noticeId, onNoticeUpdated }) => {
    const [noticeData, setNotieData] = useState({
        title: '',
        description: '',
        category_id: '',
        value_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notices/${noticeId}`);
                setNoticeData(response.data);
            } catch (err) {
                console.error('Error fetching notice:', err);
                setError('Failed to load notice data');
            }
        };

        fetchNotice();
    }, [noticeId]);

    const handleChange = (e) => {
        setNoticeData({ ...noticeData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`http://localhost:5000/api/notices/${noticeId}`, noticeData);
            console.log("Notice updated successfully");

            if (onNoticeUpdated) {
                onNoticeUpdated(noticeData);
            }
        } catch (err) {
            console.error('Error updating notice:', err);
            setError('Failed to update notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" name="title" value={noticeData.title} onChange={handleChange} disabled={loading} />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={noticeData.description} onChange={handleChange} disabled={loading} />
            </div>

            { <Categories setCategoryId={setCategoryId} setValueId={setValueId} />}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Event"}
            </button>
        </form>
    );
};

export default UpdateNotice;
