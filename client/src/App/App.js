import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../Components/Home/Home';
import Login from '../Components/Login/Login';
import SignUp from '../Components/SignUp/SignUp';
import SelectedVideo from '../Components/SelectedVideo/SelectedVideo';
import Profile from '../Components/Profile/Profile';
import Liked from '../Components/Liked/Liked';
import OTPValidation from '../Components/OTPValidation/OTPValidation';
import ForgetPassword from '../Components/Login/ForgetPassword';
import WatchLater from '../Components/WatchLater/WatchLater';
import UserUploads from '../Components/UserUploads/UserUploads';
import EditVideo from '../Components/UserUploads/EditVideo/EditVideo';
import History from '../Components/History/History';
import Search from '../Components/Search/Search';

import './App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/SelectedVideo" element={<SelectedVideo />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/like" element={<Liked />} />
                    <Route path="/OTPValidation" element={<OTPValidation />}></Route>
                    <Route path="/forgetpassword" element={<ForgetPassword />} />
                    <Route path="/watchLater" element={<WatchLater />} />
                    <Route path="/useruploads" element={<UserUploads />} />
                    <Route path="/editVideo" element={<EditVideo />} />
                    <Route path='/history' element={<History />} />
                    <Route path='/search' element={<Search />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;