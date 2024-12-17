import React, { useEffect, useState } from 'react';
import './styles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import userImg from '../../assets/user.svg';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // writing function to logout from firbase
  function handleLogout(){
    signOut(auth)
    .then(() => {
      toast.success('user logged out.');
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    })
    .catch((error) => {
      toast.error(error.message);
    });
  }
  useEffect(()=>{
    setIsLoggedIn(localStorage.getItem('isLoggedIn') || false);
  }, [])
  return (
    <div className='navbar'>
      <p className='logo'>Finacely.</p>
      {user  && isLoggedIn &&
        <div style={{ display: 'flex', alignItems: "center", gap: "0.5rem" }}>
          <img src={user.photoURL ? user.photoURL : userImg}
            style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%" }} />
          <p className='logo link' onClick={handleLogout}>Logout</p>
        </div>}
    </div>
  );
}

export default Header;
