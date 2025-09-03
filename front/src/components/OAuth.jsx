import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: result.user.displayName, 
          email: result.user.email, 
          photo: result.user.photoURL 
        }),
      })
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign with google', error);
    }
  };
  
  return (
    <button 
      onClick={handleGoogleClick} 
      type='button' 
      className='flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg uppercase border border-gray-300 hover:bg-gray-50 transition-colors w-full cursor-pointer'
    >
      <FcGoogle className='text-lg' />
      Continuar com Google
    </button>
  );
}