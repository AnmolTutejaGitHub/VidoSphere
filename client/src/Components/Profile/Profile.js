import { useState, useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import './Profile.css';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [userObj, setUserObj] = useState({});
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    async function getUserInfo() {
        const response = await axios.post('http://localhost:6969/getuser', {
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
            const response = await fetch(`http://localhost:6969/fileupload`, {
                method: 'POST',
                body: formData
            });

            setUploading(false);

            if (response.status === 200) {
                console.log("uploaded");
            }

        } catch (error) {
            console.error("Error during file upload:", error);
        }
    };

    return (<div className='profile'>
        <div><img src={`https://ui-avatars.com/api/?name=${user}`} className='home__main_profile' /></div>
        <p>{userObj?.name}</p>
        <p>{userObj?.email}</p>

        {!uploading && <p>upload a video</p>}
        {uploading && <p>uploading...</p>}

        <form onSubmit={handleFileSubmit} encType="multipart/form-data" className="uploadform">
            <input type="text" placeholder='Enter title...' required onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Enter description..." required onChange={(e) => setDescription(e.target.value)} />
            <input type="file" name="uploadfile" id="uploadfile" required />
            <div className='upload-btn-div'>
                <button type="submit" className='subscribed'>Upload</button>
            </div>
        </form>
    </div>)
}
export default Profile;