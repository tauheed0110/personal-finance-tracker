import React from 'react';
import Header from '../component/Header';
import SignupSignin from '../component/SignupSignin';

const Signup = () => {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SignupSignin />
      </div>
    </div>
  );
}

export default Signup;
