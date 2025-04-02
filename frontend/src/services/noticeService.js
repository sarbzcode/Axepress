import axios from 'axios';

//base url to access notices
const API_URL = 'http://localhost:5000/api/notices';

//export - makes function available for import in other files e.g. import {getNotices} from './noticeService';
//get to fetch all notices
export const getNotices = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

//post for creating new notice
export const createNotice = async (notice) => {
    const response = await axios.post(API_URL, notice);
    return response.data;
};

//delete to remove notice by id
export const deleteNotice = async (id) =>{
    await axios.delete(`${API_URL}/${id}`);
};