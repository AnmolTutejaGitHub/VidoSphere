import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import { CiEdit } from "react-icons/ci";
import './UserUploads.css';

function UserUploads() {
    const [UploadedVideos, setUploadedVideos] = useState([]);
    const [searchParams] = useSearchParams();
    const searchuser = searchParams.get("searchuser");
    const navigate = useNavigate();
    const [subscribers, Setsubscribers] = useState(0);
    const { user, setUser } = useContext(UserContext);

    async function findHisVideos() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userVideos`, {
            username: searchuser
        })
        setUploadedVideos(response.data);
    }

    useEffect(() => {
        findHisVideos();
        getSubscribers();
    }, [])

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

    async function getSubscribers() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getSubscribers`, {
            creator: searchuser
        })
        Setsubscribers(Number(response.data));
    }

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

    const handleEditClick = (video) => {
        navigate('/editVideo', { state: { video } });
    };

    const renderVideos = UploadedVideos.map((video) => {
        return <div className="user-uploads">
            <img
                src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className='video-thumbnail-watchLater'
                onClick={() => handleVideoClick(video)} />
            <div className="user-uploads-video-div">
                <div>
                    <p>{video.title}</p>
                </div>
                <div className="user-uploads-details">
                    <p>{video.uploadedBy}</p>
                    <p>{video.views} views</p>
                    <p>{timeAgo(video.updatedAt)}</p>
                </div>
            </div>
            <CiEdit onClick={() => handleEditClick(video)} className="video-edit" />
        </div>
    })


    return (<div className="user-upload-main-div">
        <div className="user-upload-pic-div"> <img src={`https://ui-avatars.com/api/?name=${searchuser}`} className='user-upload-user-pic' />
            <p className="upload-username">{searchuser}</p>
            <p className="selected-video-subscribers">{subscribers} Subscribers</p>
        </div>
        <div className="user-uploads-videos-div">
            {UploadedVideos.length === 0 && <div>User has not Uploaded Anything</div>}
            {renderVideos}
        </div>
    </div>
    );
}
export default UserUploads;