import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import './Liked.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MdFileUpload } from "react-icons/md";


// don't go on namings as i reused my home component
// i should have made my home comonent as base component but it was too late
// a lot of refactoring would be required 
function Liked() {
    const { user, setUser } = useContext(UserContext);
    const [likedVideos, setLiked] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/");
        return;
    }, [])

    async function getLikedVideos() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getLikedVideos`, {
            username: user
        });
        setLiked(response.data);
    }

    useEffect(() => {
        getLikedVideos();
    }, [])

    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (const interval in intervals) {
            const count = Math.floor(seconds / intervals[interval]);
            if (count > 0) {
                return count === 1 ? `${count} ${interval} ago` : `${count} ${interval}s ago`;
            }
        }
        return "just now";
    }


    const renderLiked = likedVideos.map((video) => {
        return (
            <div onClick={() => handleVideoClick(video)} className='video-div'>
                <img
                    src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className='video-thumbnail' />
                <div className='video-details'>
                    <img src={`https://ui-avatars.com/api/?name=${video.uploadedBy}`} className='home__main__video__play' />
                    <div className='video-title-div'>
                        <p>{video.title}</p>
                        <p className='video-uploaded-by'>{video.uploadedBy}</p>
                        <div className='video-views-date-div'>
                            <p className='video-views-date'>{video.views} views</p>
                            <p className='video-views-date'>. {timeAgo(video.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    });


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

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }


    return (<div className="home">
        <div className="home__side-bar">
            <div className='sidebar-nav-items' onClick={() => navigate('/home')}><FaHome /><p>Home</p></div>
            <div className='sidebar-nav-items'><FaHistory /><p>History</p> <p className='soon'>soon</p></div>
            <div className='sidebar-nav-items' onClick={() => navigate("/watchLater")}><MdOutlineWatchLater /><p>Watch Later</p></div>
            <div className='sidebar-nav-items nav-current' onClick={() => navigate('/like')} ><AiOutlineLike /><p>Liked</p></div>
            <div className='sidebar-nav-items' onClick={() => navigate('/profile')} ><MdFileUpload /><p>Upload</p></div>
            <div className='sidebar-nav-items' onClick={logout} ><MdLogout /><p>Logout</p></div>
        </div>
        <div className="home__main">
            <div className='home__main_header'>
                <input placeholder="Search for videos... (Soon)" className='search-videos-input'></input>
                <div><img src={`https://ui-avatars.com/api/?name=${user}`} className='home__main_profile' onClick={() => navigate("/profile")} /></div>
            </div>

            <div className='allvideos'>{renderLiked}</div>
        </div>
    </div >);
}
export default Liked;