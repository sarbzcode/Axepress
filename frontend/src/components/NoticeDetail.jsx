import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/NoticeDetail.css';

const NoticeDetail = () => {
    const {id} = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/notices/${id}`);
                setNotice(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notice details:', error);
                setLoading(false);
            }
        };
        fetchNotice();
    }, [id]);

    return (
        <div className='notice-detail'>
            {loading ? (
                <p>Loading...</p>
            ) : notice ? (
                <div>
                    <h2>{notice.title}</h2>
                    <p>{notice.description}</p>
                </div>
            ) : (
                <p>Notice not found.</p>
            )}
        </div>
    );
}
export default NoticeDetail;