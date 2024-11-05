import { useContext, useEffect, useState } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdFileUpload } from "react-icons/md";
import { Blocks } from 'react-loader-spinner';

function History() {
    const { user, setUser } = useContext(UserContext);
    const [watched, setWatched] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    async function getHistory() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getwatchedHistory`, {
            username: user
        });
        setWatched(response.data);
        setLoading(false);
    }

    useEffect(() => {
        getHistory();
    })

    async function deleteWatchHistory(video) {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteWatchHistory`, {
            username: user,
            video_id: video._id
        })
        const updated = watched.filter((vid) => {
            return video._id != vid._id;
        })
        setWatched(updated);
    }

    async function handleVideoClick(video) {
        video.views += 1;
        await updateVideoViews(video);
        await addToWatchedHistroy(video);
        navigate(`/SelectedVideo`, { state: video });
    }

    async function updateVideoViews(video) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateViews`, {
            video_id: video._id
        })
    }

    async function addToWatchedHistroy(video) {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addHistory`, {
            username: user,
            video_id: video._id
        })
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }

    const renderWatchHistory = watched.map((video) => {
        return <div className="watch-later-video">
            <img
                src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className='video-thumbnail-watchLater'
                onClick={() => handleVideoClick(video)} />
            <div>
                <p>{video.title}</p>
                <p>{video.uploadedBy}</p>
            </div>
            <RiDeleteBin6Line className="watch-later-bin" onClick={() => deleteWatchHistory(video)} />
        </div>
    })

    return (
        <div>
            <div className="home__side-bar paddingTop">
                <div className='sidebar-nav-items' onClick={() => navigate('/home')}><FaHome /><p>Home</p></div>
                <div className='sidebar-nav-items nav-current'><FaHistory /><p>History</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate("/watchLater")}><MdOutlineWatchLater /><p>Watch Later</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/like')} ><AiOutlineLike /><p>Liked</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/profile')} ><MdFileUpload /><p>Upload</p></div>
                <div className='sidebar-nav-items' onClick={logout} ><MdLogout /><p>Logout</p></div>
            </div>

            {loading && <div className='blocks-loader'>
                <Blocks
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                />
            </div>}

            <div className="watch-later-video-div home__main">
                {!loading && watched.length === 0 && <div>Nothing in Watch History</div>}
                {renderWatchHistory}
            </div>

        </div>
    );
}
export default History;