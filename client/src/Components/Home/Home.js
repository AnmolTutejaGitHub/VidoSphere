import './Home.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { useState, useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { user, setUser } = useContext(UserContext);
    const [allVideos, SetallVideos] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    async function fetchAllVideos() {
        const response = await axios.get(`http://localhost:6969/allVideos`);
        SetallVideos(response.data);
    }

    useEffect(() => {
        fetchAllVideos();
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

    const renderVideos = allVideos.map((video) => {
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

    function handleVideoClick(video) {
        navigate(`/SelectedVideo`, { state: video });
    }

    return (
        <div className="home">
            <div className="home__side-bar">
                <div className='sidebar-nav-items'><FaHome /><p>Home</p></div>
                <div className='sidebar-nav-items'><FaHistory /><p>History</p></div>
                <div className='sidebar-nav-items'><MdOutlineWatchLater /><p>Watch Later</p></div>
                <div className='sidebar-nav-items'><AiOutlineLike /><p>Liked</p></div>
            </div>
            <div className="home__main">
                <div className='home__main_header'>
                    <input placeholder="Search for videos..." className='search-videos-input'></input>
                    <div><img src={`https://ui-avatars.com/api/?name=${user}`} className='home__main_profile' onClick={() => navigate("/profile")} /></div>
                </div>

                <div className='allvideos'>{renderVideos}</div>
            </div>
        </div >
    )
}
export default Home;