import React from 'react';
import './styles.css';

const Header = () => {

  function handleLogout(){
    alert('user logout');
  }
  return (
    <div className='navbar'>
      <p className='logo'>Finacely.</p>
      <p className='logo link' onClick={handleLogout}>Logout</p>
    </div>
  );
}

export default Header;
