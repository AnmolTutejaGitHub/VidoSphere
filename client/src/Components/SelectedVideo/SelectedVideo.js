import { useLocation, useNavigate } from 'react-router-dom';
import './SelectedVideo.css';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import { CiBellOn } from "react-icons/ci";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { MdFileUpload } from "react-icons/md";

function SelectedVideo() {

    const notify = (text) => toast.success(text);
    const location = useLocation();
    const navigate = useNavigate();
    const video = location.state;
    const [subscribed, setSubscribed] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const [subscribers, Setsubscribers] = useState(0);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentButton, setCommentShowButton] = useState(false);

    const [liked, setLiked] = useState(false);

    async function subscribe() {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subscribe`, {
            videoId: video.id,
            subscribed: !subscribed,
            user: user,
            creator: video.uploadedBy
        });

        if (!subscribed) Setsubscribers(subscribers + 1);
        else Setsubscribers(subscribers - 1);
        setSubscribed(!subscribed);
    }

    async function isSubscribed() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/isSubscribed`, {
                creator: video.uploadedBy,
                user: user
            })
            if (response.status == 200) setSubscribed(true);
        } catch (e) {
            console.log(e);
        }
    }

    async function getSubscribers() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getSubscribers`, {
            creator: video.uploadedBy
        })
        Setsubscribers(Number(response.data));
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            AddComment(comment);
            setComment('');
            setCommentShowButton(false);
        }
    }

    const handleCommentInputChange = (e) => {
        setComment(e.target.value);
        setCommentShowButton(e.target.value.length > 0);
    };

    async function AddComment(comment) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addComments`, {
                video_id: video._id,
                user: user,
                comment: comment
            });
            setComments(response.data);
        } catch (error) {
            console.log("Error Adding comment", error);
        }
    }

    async function getPrevComments() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getComments`, {
            video_id: video._id
        })
        setComments(response.data);
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const renderComments = comments.map((com) => {
        return <div className='comment-div'>
            <img src={`https://ui-avatars.com/api/?name=${com.user}`} className="comment-user-pic"></img>
            <div>
                <div className='comment-detail'>
                    <p className='comment-user'>{com.user}</p>
                    <p className='comment-time'>{timeAgo(com.uploadedAt)}</p>
                </div>
                <div>{com.content}</div>
            </div>
        </div>
    })


    async function likeVideo() {
        try {

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likeVideo`, {
                video_id: video._id,
                like: !liked,
                username: user
            });

            if (response.status === 200) {
                setLiked(!liked);
            } else {
                console.error("Failed to like/unlike the video. Status:", response.status);
            }
        } catch (error) {
            console.error("Error liking/unliking video:", error);
        }
    }

    async function isLiked() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/islikeVideo`, {
                video_id: video._id,
                username: user
            })
            if (response.status == 200) setLiked(true);
        } catch (e) {
            console.log("Not liked")
        }
    }

    async function watchLater() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addWatchLater`, {
            video_id: video._id,
            username: user,
        })
        notify("Added to watch Later");
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }

    useEffect(() => {
        isSubscribed();
        getSubscribers();
        getPrevComments();
        isLiked();
    }, [])

    return (
        <div className='home'>
            <div className="home__side-bar">
                <div className='sidebar-nav-items nav-current' onClick={() => navigate('/home')}><FaHome /><p>Home</p></div>
                <div className='sidebar-nav-items'><FaHistory /><p>History</p> <p className='soon'>soon</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate("/watchLater")} ><MdOutlineWatchLater /><p>Watch Later</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/like')} ><AiOutlineLike /><p>Liked</p></div>
                <div className='sidebar-nav-items' onClick={() => navigate('/profile')} ><MdFileUpload /><p>Upload</p></div>
                <div className='sidebar-nav-items' onClick={logout} ><MdLogout /><p>Logout</p></div>
            </div>

            <div className="selected-video-div home__main">
                <ToastContainer className="toast-container" />
                <ReactPlayer url={video.url} height="65%" width="95%" controls={true} playing={false}
                    config={{
                        youtube: {
                            playerVars: { showinfo: 1 }
                        }
                    }}
                />
                <div className='selected-video-details'>
                    <p className="selected-video-title">{video.title}</p>
                    <div className='creator-detail-div'>
                        <img src={`https://ui-avatars.com/api/?name=${video.uploadedBy}`} className='selected__video__play' />
                        <div className='creator-detail'>
                            <p className="selected-video-username">{video.uploadedBy}</p>
                            <p className="selected-video-subscribers">{subscribers} Subscribers</p>
                        </div>
                        <button className={!subscribed ? 'subscribe-btn' : 'subscribed'} onClick={subscribe}>{subscribed && <CiBellOn className='bell-icon' />} {subscribed ? 'Subscribed' : 'Subscribe'}</button>
                        <div className='like-div'>
                            <div onClick={likeVideo}>
                                {!liked && <AiOutlineLike className='like-unlike' />}
                                {liked && <AiFillLike className='like-unlike' />}
                            </div>
                            <MdOutlineWatchLater className='watch-later-selected' onClick={watchLater} />
                        </div>
                    </div>
                </div>

                <div className='comments'>
                    <p className='comment-count'>{comments.length} Comments</p>
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            placeholder="Add a Comment ..."
                            className="comment-input"
                            value={comment}
                            onChange={handleCommentInputChange}
                        />
                        {showCommentButton && (
                            <button type="submit" className="comment-btn">
                                Submit
                            </button>
                        )}
                    </form>

                    <div className='video-description'>
                        <div className='video-description-details'>
                            <p className='desc-bg'>{video.views} views</p>
                            <p className='desc-bg'>Published on {formatDate(video.updatedAt)}</p>
                        </div>
                        <div className='desc-bg'>
                            {video.description}
                        </div>
                    </div>

                    <div className='comments-div'>{renderComments}</div>
                </div>
            </div>
        </div>
    )
}
export default SelectedVideo;