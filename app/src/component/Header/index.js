import React from 'react';
import './styles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import userImg from '../../assets/user.svg';
const Header = () => {
  const [user] = useAuthState(auth);
  function handleLogout() {
    alert('user logout');
  }
  return (
    <div className='navbar'>
      <p className='logo'>Finacely.</p>
      {user &&
        <div style={{ display: 'flex', alignItems: "center", gap: "0.5rem" }}>
          <img src={user.photoURL ? user.photoURL : userImg}
            style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%" }} />
          <p className='logo link' onClick={handleLogout}>Logout</p>
        </div>}
    </div>
  );
}

export default Header;
