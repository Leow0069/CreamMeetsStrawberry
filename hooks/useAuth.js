import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { useAuthConfig } from '../configurations/config';
import { auth } from '../configurations/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() =>
        onAuthStateChanged(auth, (user) => {
            // console.log(user);
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        }), [])

    const signInWithGoogle = async() => {
        await Google.logInAsync(useAuthConfig).then(async(logInResult)=>{
            if (logInResult.type ==='success') {
                const {idToken, accessToken} = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }
            return Promise.reject();
        }).catch((error) => setError(error))
    }

    const logout = () => {
        signOut(auth).catch((error) => setError(error));
    }

    return (
        <AuthContext.Provider value={{user, signInWithGoogle, error, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export default function useAuth() {
    return useContext(AuthContext);
};