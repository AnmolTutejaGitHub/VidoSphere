import { useState, useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdFileUpload } from "react-icons/md";

function Profile() {
    const notify = (text) => toast.success(text);
    const { user, setUser } = useContext(UserContext);
    const [userObj, setUserObj] = useState({});
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    async function getUserInfo() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getuser`, {
            user: user
        })
        setUserObj(response.data);
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('uploadfile');
        const file = fileInput.files[0];
        console.log(file);

        if (!file) {
            console.log("No file selected")
            return;
        }

        const formData = new FormData();
        formData.append('uploadfile', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('user', user);

        try {
            setUploading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fileupload`, {
                method: 'POST',
                body: formData
            });

            setUploading(false);

            if (response.status === 200) {
                notify("uploaded");
                console.log("uploaded");
            } else {
                notify("Wrong Format or Exceeded 100MB")
            }

        } catch (error) {
            notify("Wrong Format or Exceeded 100MB")
            console.error("Error during file upload:", error);
        }
    };

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser('');
        navigate('/');
    }

    return (<div>
        <ToastContainer className="toast-container" />

        <div className="home__side-bar paddingTop">
            <div className='sidebar-nav-items' onClick={() => navigate('/home')}><FaHome /><p>Home</p></div>
            <div className='sidebar-nav-items'><FaHistory /><p>History</p> <p className='soon'>soon</p></div>
            <div className='sidebar-nav-items' onClick={() => navigate("/watchLater")}><MdOutlineWatchLater /><p>Watch Later</p></div>
            <div className='sidebar-nav-items' onClick={() => navigate('/like')} ><AiOutlineLike /><p>Liked</p></div>
            <div className='sidebar-nav-items  nav-current' onClick={() => navigate('/profile')} ><MdFileUpload /><p>Upload</p></div>
            <div className='sidebar-nav-items' onClick={logout} ><MdLogout /><p>Logout</p></div>
        </div>

        <div className='profile'>
            {/* <button onClick={() => logout()} className='profile-logout nav-btn'>logout</button> */}
            <div><img src={`https://ui-avatars.com/api/?name=${user}`} className='home__main_profile' /></div>
            <p>{userObj?.name}</p>
            <p>{userObj?.email}</p>

            {!uploading && <p>upload a video</p>}
            {uploading && <p>uploading...</p>}

            <form onSubmit={handleFileSubmit} encType="multipart/form-data" className="uploadform">
                <input type="text" placeholder='Enter title...' required onChange={(e) => setTitle(e.target.value)} className='upload-input' />
                <input type="text" placeholder="Enter description..." required onChange={(e) => setDescription(e.target.value)} className='upload-input' />
                <input type="file" name="uploadfile" id="uploadfile" required />
                <div className='upload-btn-div'>
                    <button type="submit" className='subscribed'>Upload</button>
                </div>
            </form>
            <div className='important-info'>*Accepted Formats are 'mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv' And file Should not exceed 100MB</div>
            <div className='important-info'> ** lol Vercel’s request body limit is around 4 MB for serverless functions.
                Unless I change the deployment server , Video upload limit is 4MB.</div>
        </div>
    </div>)
}
export default Profile;