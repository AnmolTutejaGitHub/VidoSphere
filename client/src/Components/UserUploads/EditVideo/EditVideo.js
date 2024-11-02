import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditVideo.css';
import { useNavigate } from 'react-router-dom';

function EditVideo() {
    const location = useLocation();
    const video = location.state.video;
    const notify = (text) => toast.success(text);
    const navigate = useNavigate();

    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);
    const [showTitleEditButton, setShowTitileBtn] = useState(false);
    const [showDescriptionEditButton, setShowDescriptionTitleBtn] = useState(false);

    function handleTitleChange(e) {
        setTitle(e.target.value);
        setShowTitileBtn(true);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
        setShowDescriptionTitleBtn(true);
    }

    async function handleTitleEdit(e) {
        e.preventDefault();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changeVideoTitle`, {
            video_id: video._id,
            title: title
        });
        video.title = title;
        setShowTitileBtn(false);
        notify(response.data);
    }

    async function handleDescriptionEdit(e) {
        e.preventDefault();
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changeVideoDescription`, {
            video_id: video._id,
            description: description
        });
        video.description = description;
        setShowDescriptionTitleBtn(false);
        notify(response.data);
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

    return (
        <div className="edit-video-div">
            <ToastContainer className="toast-container" />
            <h1 className="edit-video-h1">Edit Video</h1>
            <img
                src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className='video-thumbnail edit-thumbnail'
                onClick={() => handleVideoClick(video)} />
            <form onSubmit={(e) => handleTitleEdit(e)} className="comment-form edit-form">
                <h1>Title</h1>
                <textarea
                    placeholder="Add a Comment ..."
                    className="comment-input edit-input"
                    value={title}
                    onChange={(e) => handleTitleChange(e)}
                />
                {showTitleEditButton && (
                    <button type="submit" className="comment-btn">
                        Save
                    </button>
                )}
            </form>

            <form onSubmit={(e) => handleDescriptionEdit(e)} className="comment-form edit-form">
                <h1>Description</h1>
                <textarea
                    placeholder="Add a Comment ..."
                    className="comment-input edit-input"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e)}
                />
                {showDescriptionEditButton && (
                    <button type="submit" className="comment-btn">
                        Save
                    </button>
                )}
            </form>
        </div>
    );
}
export default EditVideo;