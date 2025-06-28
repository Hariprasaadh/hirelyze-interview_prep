'use server'

import { auth, db } from "../../../firebase/admin";
import { cookies } from "next/headers";   

const ONE_WEEK = 60 * 60 * 24 * 7; 


// Action for sign up
export async function signUp(params: SignUpParams): Promise<AuthResponse> {

    const { uid, name, email } = params;

    try {
        // Check if user already exists in Firestore
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            };
        }

        // Create user document in Firestore
        await db.collection('users').doc(uid).set({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return {
            success: true,
            message: 'Sign up successful. You can now sign in.'
        };

    } catch (e: any) {
        console.error("Error during sign up:", e);
        
        if (e.code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email already in use. Please use a different email.'
            };
        }

        return {
            success: false,
            message: 'An error occurred during sign up. Please try again later.'
        };
    }
}

// Action for sign in
export async function signIn(params: SignInParams): Promise<AuthResponse> {
    const { email, idToken } = params;

    try {
        // Verify the user exists in Firebase Auth
        const userRecord = await auth.getUserByEmail(email.toLowerCase().trim());

        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };
        }

        // Ensure Firestore document exists (defensive programming)
        await ensureUserDocumentExists(userRecord.uid, userRecord);

        // Set session cookie
        const setCookieResult = await setSessionCookie(idToken);
        
        if (!setCookieResult.success) {
            return {
                success: false,
                message: "Failed to create session. Please try again.",
            };
        }

        // Get the user data to return
        const userData = await getCurrentUser();

        return {
            success: true,
            message: "Sign in successful.",
            user: userData || undefined
        };

    } catch (error: any) {
        console.error("Error during sign in:", error);

        if (error.code === 'auth/user-not-found') {
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };
        }

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Helper function to ensure user document exists in Firestore
async function ensureUserDocumentExists(uid: string, authUser?: any) {
    try {
        const firestoreDoc = await db.collection('users').doc(uid).get();
        
        if (!firestoreDoc.exists) {
            // Get user info from Firebase Auth if not provided
            if (!authUser) {
                authUser = await auth.getUser(uid);
            }

            // Create missing Firestore document
            await db.collection('users').doc(uid).set({
                name: authUser.displayName || authUser.email?.split('@')[0] || 'Unknown User',
                email: authUser.email || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            console.log(`Created missing Firestore document for user: ${uid}`);
        }
    } catch (error) {
        console.error("Error ensuring user document exists:", error);
        throw error;
    }
}

// Set session cookie
export async function setSessionCookie(idToken: string): Promise<{ success: boolean; message?: string }> {
    try {
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
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax', 
            }
        );

        return { success: true };
    } catch (error) {
        console.error("Error setting session cookie:", error);
        return { 
            success: false, 
            message: "Failed to create session cookie" 
        };
    }
}

// Clear session cookie
export async function clearSessionCookie(): Promise<{ success: boolean }> {
    try {
        const cookieStore = await cookies();
        
        cookieStore.set(
            'session',
            '',
            {
                maxAge: 0,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
            }
        );

        return { success: true };
    } catch (error) {
        console.error("Error clearing session cookie:", error);
        return { success: false };
    }
}

// Get current authenticated user using session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null; // No session cookie found
    }

    try {
        // Verify session cookie
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        
        // Ensure user document exists in Firestore (defensive programming)
        await ensureUserDocumentExists(decodedClaims.uid);
        
        // Get user document from Firestore
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) {
            console.error(`User document still doesn't exist after creation attempt: ${decodedClaims.uid}`);
            return null;
        }

        const userData = userRecord.data();
        
        return {
            id: userRecord.id,
            name: userData?.name || 'Unknown User',
            email: userData?.email || '',
            createdAt: userData?.createdAt,
            updatedAt: userData?.updatedAt
        } as User;

    } catch (e: any) {
        console.error("Error getting current user:", e);
        
        // If session is invalid, clear the cookie automatically
        if (e.code === 'auth/session-cookie-expired' || 
            e.code === 'auth/session-cookie-revoked' ||
            e.message?.includes('no user record corresponding')) {
            await clearSessionCookie();
        }
        
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

// Sign out user
export async function signOut(): Promise<AuthResponse> {
    try {
        await clearSessionCookie();
        
        return {
            success: true,
            message: "Signed out successfully."
        };
    } catch (error) {
        console.error("Error during sign out:", error);
        return {
            success: false,
            message: "Error occurred during sign out."
        };
    }
}