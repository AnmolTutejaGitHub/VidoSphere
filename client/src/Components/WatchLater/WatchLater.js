import { useState } from "react";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import './WatchLater.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdFileUpload } from "react-icons/md";

function WatchLater() {
    const { user, setUser } = useContext(UserContext);
    const [watchLater, setWatchLater] = useState([]);
    const navigate = useNavigate();

    async function getWatchLater() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getWatchList`, {
            username: user
        })
        setWatchLater(response.data);
    }

    async function deleteWatchLater(video) {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteWatchList`, {
            username: user,
            video_id: video._id
        })
        const updated = watchLater.filter((vid) => {
            return video._id != vid._id;
        })
        setWatchLater(updated);
    }

    async function handleVideoClick(video) {
        video.views += 1;
        await updateVideoViews(video);
        navigate(`/SelectedVideo`, { state: video });
    }

    async function updateVideoViews(video) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateViews`, {
            video_id: video._id
        })
    }

    useEffect(() => {
        getWatchLater();
    }, [])

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }

    const renderWatchList = watchLater.map((video) => {
        return <div className="watch-later-video">
            <img
                src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className='video-thumbnail-watchLater'
                onClick={() => handleVideoClick(video)} />
            <div>
                <p>{video.title}</p>
                <p>{video.uploadedBy}</p>
            </div>
            <RiDeleteBin6Line className="watch-later-bin" onClick={() => deleteWatchLater(video)} />
        </div>
    })

    return (
        <div>
            <div className="home__side-bar paddingTop">
                <div className='sidebar-nav-items' onClick={() => navigate('/home')}><FaHome /><p>Home</p></div>
                <div className='sidebar-nav-items'><FaHistory /><p>History</p> <p className='soon'>soon</p></div>
                <div className='sidebar-nav-items nav-current' onClick={() => navigate("/watchLater")}><MdOutlineWatchLater /><p>Watch Later</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/like')} ><AiOutlineLike /><p>Liked</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/profile')} ><MdFileUpload /><p>Upload</p></div>
                <div className='sidebar-nav-items' onClick={logout} ><MdLogout /><p>Logout</p></div>
            </div>

            <div className="watch-later-video-div home__main">
                {watchLater.length === 0 && <div>Nothing in WatchList</div>}
                {renderWatchList}
            </div>

        </div>
    );
}
export default WatchLater;