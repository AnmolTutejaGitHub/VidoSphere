import { useLocation } from 'react-router-dom';
import './SelectedVideo.css';
import ReactPlayer from 'react-player';

function SelectedVideo() {

    const location = useLocation();
    const video = location.state;

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
                    <img src={`https://ui-avatars.com/api/?name=${video.uploadedBy.name}`} className='selected__video__play' />
                    <div className='creator-detail'>
                        <p className="selected-video-username">{video.uploadedBy.name}</p>
                        <p className="selected-video-subscribers">{video.uploadedBy.Subscribers} Subscribers</p>
                    </div>
                    <button className='subscribe-btn'>Subscribe</button>
                </div>
                <div>
                    <div className='like-dislike'></div>
                </div>

            </div>
        </div>
    )
}
export default SelectedVideo;