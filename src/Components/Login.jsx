import React from 'react';
import { Fingerprint, LogIn as LoginIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// auth-step-3
import { signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Framer Motion
import { motion } from 'framer-motion';

async function createUser(authData) {
    const userObject = authData.user;
    const { uid, photoURL, displayName, email } = userObject;
    await setDoc(doc(db, "users", uid), {
        email,
        profile_pic: photoURL,
        name: displayName
    });
}

function Login() {
    const navigate = useNavigate();
    const handleLogin = async () => {
        // login logic 
        const userData = await signInWithPopup(auth, new GoogleAuthProvider);
        await createUser(userData);
        navigate("/");
    };

    return (
        <>
            <div className='h-[220px] bg-primary'>
                <div className='flex ml-[200px] pt-10 items-center gap-4'>
                    <img src="https://whatsapp-clone-826a9.web.app/whatsapp.svg" alt=""
                        className='h-8'
                    />
                    <div className="text-white uppercase font-medium">Whatsapp</div>
                </div>
            </div>
            <div className='h-[calc(100vh-220px)] bg-background flex justify-center items-center relative'>
                <div className='h-[80%] w-[50%] bg-white shadow-2xl flex flex-col gap-4 justify-center items-center absolute -top-[93px]'>
                    {/* Animating the fingerprint symbol */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Fingerprint className='h-20 w-20 text-primary' strokeWidth={1} />
                    </motion.div>

                    {/* Animating the Sign-In text */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className='text-2xl font-medium mb-2'
                    >
                        Sign In
                    </motion.div>

                    {/* Animating the description text */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className='text-xs font-light text-slate-500 text-center'
                    >
                        Sign in with your Google account <br />to get started.
                    </motion.div>

                    {/* Button */}
                    <motion.button
                        onClick={handleLogin}
                        className='flex gap-2 items-center bg-primary p-4 text-white rounded-[5px] transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <div>
                            Sign in with Google
                        </div>
                        <LoginIcon />
                    </motion.button>
                </div>
            </div>
        </>
    );
}

export default Login;
