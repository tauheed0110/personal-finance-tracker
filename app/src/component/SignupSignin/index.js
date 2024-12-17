import React, { useEffect, useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const SignupSignin = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingEmailState, setLoadingEmailState] = useState(false);
  const [loadingGoogleState, setLoadingGoogleState] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user && isLoggedIn) {
      navigate('/dashboard');
    }
  }, [user]);
  useEffect(() => {
    const flag = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    if (flag) {
      setIsLoggedIn(true);
    }
  }, [])

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
            setLoginForm(true);
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
          localStorage.setItem('isLoggedIn', JSON.stringify(true));
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
      } else {
        toast.error("Doc already exists");
        setLoadingEmailState(false);
      }
    } catch (e) {
      toast.error(e.message);
      setLoadingEmailState(false);
    }
  }

  function SignInUpWithGoogle(e) {
    e.preventDefault();
    setLoadingGoogleState(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;

        // Get additional user information
        const isNewUser = result._tokenResponse.isNewUser;

        if (isNewUser) {
          console.log("Signing up a new user:");
          console.log("User Info:", user);
          // Perform sign-up-specific actions here
          toast.success('user signup successful');
          setLoadingGoogleState(false);
          setLoginForm(true);
        } else {
          console.log("Logging in an existing user:");
          console.log("User Info:", user);
          // Perform login-specific actions here
          localStorage.setItem('isLoggedIn', JSON.stringify(true));
          toast.success('user logged in');
          navigate('/dashboard');
          setLoadingGoogleState(false);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Error during Google authentication:", errorMessage);
        setLoadingGoogleState(false);
        toast.error(errorMessage);
      });

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
            <Button disabled={loadingGoogleState} text={loadingGoogleState ? 'Loading...' : 'Login Using Google'} blue={true} onClick={(e) => { SignInUpWithGoogle(e) }} />
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
            <Button disabled={loadingGoogleState} text={loadingGoogleState ? 'Loading...' : 'Signup Using Google'} blue={true} onClick={(e) => { SignInUpWithGoogle(e) }} />
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