import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@styles/CreateNotice.css';

const CreateNotice = ({ onNoticeAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/auth/admindashboard', {withCredentials: true});
          } catch (error) {
            console.error('User not logged in:', error);
            setIsLoggedIn(false);
            navigate('/login');
          }
        };
        checkLoginStatus();
      }, [navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error){
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!title.trim() || !description.trim()) {
            alert('All fields must be filled!');
            setLoading(false);
            return;
        }
    
        if (!categoryId) {
            alert('Invalid category selection!');
            setLoading(false);
            return;
        }
    
        try {
            const noticeData = {
                title,
                description,
                category_id: categoryId,
            };

            console.log('Notice Data:', noticeData);
    
            const response = await axios.post("http://localhost:5000/api/notices", noticeData);
            console.log("Notice created successfully:", response.data);
    
            if (onNoticeAdded) {
                onNoticeAdded(response.data);
            }
    
            setTitle("");
            setDescription("");
            setLoading(false);
        } catch (err) {
            console.error('Error creating notice:', err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to create notice");
            setLoading(false);
        } 
    };

    return (
    <form onSubmit={handleSubmit} className="create-notice-form">
    <div className="form-header">
        <h2>Create a Notice!</h2>
    </div>
    <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
    </div>
    <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
    </div>
    <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={loading}>
            <option value="">Select Category</option>
            {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
            ))}
        </select>
    </div>
    <button type="submit" disabled={loading} className="submit-button">{loading ? "Creating..." : "Create Notice"}</button>
 </form>
    );
};

export default CreateNotice;