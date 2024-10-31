import './Home.css';
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { useState, useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';

function Home() {
    const { user, setUser } = useContext(UserContext);
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
                    <div><img src={`https://ui-avatars.com/api/?name=${user}`} className='home__main_profile' /></div>
                </div>
            </div>
        </div >
    )
}
export default Home;