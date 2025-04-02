import React, { useState } from 'react';
import axios from 'axios';
import Categories from './Categories';

const CreateNotice = ({ onNoticeAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [valueId, setValueId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Log the values to check if they are set correctly
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Category ID:", categoryId);
        console.log("Value ID:", valueId);
    
        if (!title.trim() || !description.trim()) {
            alert('Title and description cannot be empty!');
            setLoading(false);
            return;
        }
    
        if (!categoryId || !valueId) {
            alert('Invalid category or value selection!');
            setLoading(false);
            return;
        }
    
        try {
            const noticeData = {
                title,
                description,
                category_id: categoryId,
                value_id: valueId,
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            {/* Corrected prop names */}
            <Categories setCategoryFilter={setCategoryId} setValueFilter={setValueId} />
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Notice"}</button>
        </form>
    );
};

export default CreateNotice;