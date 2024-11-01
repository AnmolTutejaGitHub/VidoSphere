import { useLocation } from 'react-router-dom';
import './SelectedVideo.css';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import { CiBellOn } from "react-icons/ci";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';

function SelectedVideo() {

    const location = useLocation();
    const video = location.state;
    const [subscribed, setSubscribed] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const [subscribers, Setsubscribers] = useState(0);

    async function subscribe() {
        await axios.post('http://localhost:6969/subscribe', {
            videoId: video.id,
            subscribed: !subscribed,
            user: user,
            creator: video.uploadedBy
        });

        if (!subscribed) subscribers += 1;
        else subscribers -= 1;
        setSubscribed(!subscribed);
    }

    async function isSubscribed() {
        try {
            const response = await axios.post('http://localhost:6969/isSubscribed', {
                creator: video.uploadedBy,
                user: user
            })
            if (response.status == 200) setSubscribed(true);
        } catch (e) {
            console.log(e);
        }
    }

    async function getSubscribers() {
        const response = await axios.post('http://localhost:6969/getSubscribers', {
            creator: video.uploadedBy
        })
        Setsubscribers(response.data);
    }

    useEffect(() => {
        isSubscribed();
        getSubscribers();
    }, [])

    return (
        <div className="selected-video-div">
            <ReactPlayer url={video.url} height="65%" width="70%" controls={true} playing={false}
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
                </div>
                <div>
                    <div className='like-dislike'></div>
                </div>
            </div>
        </div>
    )
}
export default SelectedVideo;