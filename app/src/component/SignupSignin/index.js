import React, { useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const SignupSignin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingEmailState, setLoadingEmailState] = useState(false);
  const [loadingGoogleState, setLoadingGoogleState] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

  function handleSignUpWithEmail(e) {
    e.preventDefault();
    setLoadingEmailState(true);
    if (name.trim() && email && password && confirmPassword) {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            toast.success('user created successfully');
            setLoadingEmailState(false);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // create doc for the user with uid
            createDoc(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoadingEmailState(false);
          });
      } else {
        toast.error("Password and Confirm Password don't macth");
        setLoadingEmailState(false);
      }
    } else {
      toast.error('All* fields are mandatory');
      setLoadingEmailState(false);
    }
  }
  function handleLogin(e) {
    e.preventDefault();
    setLoadingEmailState(true);
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success('user login successful')
          setLoadingEmailState(false);
          setEmail('')
          setPassword('');
          navigate('/dashboard');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.success(errorMessage)
          setLoadingEmailState(false);
        });
    } else {
      toast.error('All* fields are mandatory');
      setLoadingEmailState(false);
    }
  }

  async function createDoc(user) {
    setLoadingEmailState(true);
    if (!user) return
    const useRef = doc(db, 'users', user.uid);
    try {
      const userData = await getDoc(useRef);
      if (!userData.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : '',
          createdAt: new Date()
        });
        toast.success('Doc created');
        setLoadingEmailState(false);
      }else{
        toast.error("Doc already exists");
        setLoadingEmailState(false);
      }
    } catch (e) {
      toast.error(e.message);
      setLoadingEmailState(false);
    }
  }
  return (
    <>
      {loginForm ? (
        <div className='signup-wrapper'>
          <p className='title'>Login in <span style={{ color: 'var(--theme)' }}>Financely.</span></p>
          <form>
            <Input
              label={"Email"}
              type={"email"}
              placeholder={"johndoe@gmail.com"}
              state={email}
              setState={setEmail}
            />
            <Input
              label={"Password"}
              type={"password"}
              placeholder={"Example@123"}
              state={password}
              setState={setPassword}
            />
            <Button disabled={loadingEmailState} text={loadingEmailState ? 'Loading...' : 'Login Using Email and Password'} onClick={(e) => { handleLogin(e) }} />
            <p style={{ textAlign: 'center' }}>or</p>
            <Button disabled={loadingGoogleState} text={loadingGoogleState ? 'Loading...' : 'Login Using Google'} blue={true} />
            <p disabled={loadingGoogleState || loadingEmailState} className='p-login' onClick={() => { setLoginForm(!loginForm) }}>Or Don't Have An Account? <span style={{ color: 'var(--theme)' }}>Click Here</span></p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <p className='title'>Signup in <span style={{ color: 'var(--theme)' }}>Financely.</span></p>
          <form>
            <Input
              label={"Full Name"}
              type={"text"}
              placeholder={"John Doe"}
              state={name}
              setState={setName}
            />
            <Input
              label={"Email"}
              type={"email"}
              placeholder={"johndoe@gmail.com"}
              state={email}
              setState={setEmail}
            />
            <Input
              label={"Password"}
              type={"password"}
              placeholder={"Example@123"}
              state={password}
              setState={setPassword}
            />
            <Input
              label={"Confirm Password"}
              type={"password"}
              placeholder={"Example@123"}
              state={confirmPassword}
              setState={setConfirmPassword}
            />
            <Button disabled={loadingEmailState} text={loadingEmailState ? 'Loading...' : 'Signup Using Email and Password'} onClick={(e) => { handleSignUpWithEmail(e) }} />
            <p style={{ textAlign: 'center' }}>or</p>
            <Button disabled={loadingGoogleState} text={loadingGoogleState ? 'Loading...' : 'Signup Using Google'} blue={true} />
            <p disabled={loadingGoogleState || loadingEmailState} className='p-login' onClick={() => { setLoginForm(!loginForm) }}>Or Already Have An Account? <span style={{ color: 'var(--theme)' }}>Click Here</span></p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;

//   const [myBorder, setmyBorder] = useState(false);
// style={{ border: myBorder ? '2px solid var(--theme)' : 'none' }} onFocus={() => { setmyBorder(true) }} onBlur={()=>{setmyBorder(false)}}