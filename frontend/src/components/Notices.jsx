//React - to use .jsx features
//useEffect - runs effects like fetching data after component mounts
//useState - managing state within component
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getNotices } from '../services/noticeService';
import Categories from './Categories';
import '../styles/Notices.css';

const Notices = () => {    
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [valueFilter, setValueFilter] = useState('');

    useEffect(() => {
        async function fetchNotices() {
            try {
                const queryParams = [];
                if (categoryFilter) {
                    queryParams.push(`categoryId=${categoryFilter}`);
                }
                if (valueFilter) {
                    queryParams.push(`valueId=${valueFilter}`);
                }
                const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
                const response = await axios.get(`http://localhost:5000/api/notices${queryString}`);
                setNotices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notices:', error);
                setLoading(false);
            }
        };
        fetchNotices();
    }, [categoryFilter, valueFilter]);

    //rendering notices
    return (
        <div>
          <Categories setCategoryFilter={setCategoryFilter} setValueFilter={setValueFilter} />
          <div className="notices-container">
            <h2>Upcoming Notices!</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              notices.length > 0 ? (
                <ul className="cards-list">
                  {notices.map((notice) => (
                    <li key={notice.id} className="notice-card">
                      <h3>{notice.title}</h3>
                      <p>{notice.description}</p>
                      <a className="details" href={`/notices/${notice.id}`}>View Details</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notices found for the selected filters.</p>
              )
            )}
          </div>
        </div>
    );           
};

export default Notices;