'use server'

import { cookies } from "next/headers";
import { auth, db } from "../../../firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7 ; 


//Action for sign up
export async function signUp(params : SignUpParams){
    const {uuid, name, email } = params;

    try{
        const userRecord = await db .collection('users').doc(uuid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uuid).set({
            name, email
        }); 

        return {
            success: true,
            message: 'Sign up successful. You can now sign in.'
        }

    } catch(e: any){
        console.error("Error during sign up:", e);
        if(e.code === 'auth/email-already-in-use'){
            return {
                success: false,
                message: 'Email already in use. Please use a different email.'
            }
        }

        return{
            success: false,
            message: 'An error occurred during sign up. Please try again later.'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    
    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up first.'
            };
        }

         await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Sign in successful.'
        };

    } catch (error) {
        console.error("Error during sign in:", error);
        return {
            success: false,
            message: 'An error occurred during sign in. Please try again later.'
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000, // Convert seconds to milliseconds
    });

    cookieStore.set(
        'session',
        sessionCookie,
        {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            path: '/',
            sameSite: 'lax', 
        }
    )
}

