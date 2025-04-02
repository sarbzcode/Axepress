import React from 'react';
import axios from 'axios';

const DeleteNotice = ({ noticeId, onNoticeDeleted }) => {
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/notices/${noticeId}`);
            console.log("Notice deleted successfully");

            if (onNoticeDeleted) {
                onNoticeDeleted(noticeId);
            }
        } catch (error) {
            console.error("Error deleting notice:", error);
        }
    };

    return <button onClick={handleDelete}>Delete Notice</button>;
};

export default DeleteNotice;