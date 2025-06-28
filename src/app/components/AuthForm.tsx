"use client"

import { zodResolver } from "@hookform/resolvers/zod"  // Import zod resolver for form validation
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner" // Import toast for notifications

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../firebase/client"
import { signUp, signIn } from "@/lib/actions/auth.action"


const authFormScheme = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter()
    const formSchema = authFormScheme(type)

    // Define the form using default values and validation schema.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            form.clearErrors(); // Clear any previous errors
            
            if (type === "sign-up") {
                const { name, email, password } = values;

                if (!name) {
                    toast.error("Name is required for sign up");
                    return;
                }

                // Create user in Firebase Auth
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                // Create user document in Firestore
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name,
                    email,
                });

                if (!result.success) {
                    toast.error(result.message || "Failed to create account. Please try again.");
                    return;
                }

                toast.success("Account created successfully! Please sign in.");
                router.push("/sign-in");

            } else if (type === "sign-in") {
                const { email, password } = values;

                // Sign in with Firebase Auth
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Failed to get authentication token. Please try again.");
                    return;
                }

                // Sign in on server side
                const result = await signIn({
                    email,
                    idToken,
                });

                if (!result.success) {
                    toast.error(result.message || "Failed to sign in. Please try again.");
                    return;
                }

                toast.success("Signed in successfully!");
                router.push("/");
            }

        } catch (error: any) {
            console.error("Error submitting form:", error);
            
            // Handle specific Firebase Auth errors
            let errorMessage = "An unexpected error occurred. Please try again.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email is already in use. Please use a different email or sign in.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please choose a stronger password.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email. Please sign up first.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password. Please try again.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address. Please check and try again.";
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled. Please contact support.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please try again later.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={38}
                        height={32}
                        className="rounded-full"
                    />
                    <h2 className="text-primary-100">HireLyze</h2>
                </div>

                <h3>Practice. Perfect. Perform — with AI by Your Side.</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField 
                                control={form.control} 
                                name="name" 
                                label="Name" 
                                placeholder="Enter your name" 
                                type="text" 
                            />
                        )}

                        <FormField 
                            control={form.control} 
                            name="email" 
                            label="Email" 
                            placeholder="Enter your email" 
                            type="email" 
                        />

                        <FormField 
                            control={form.control} 
                            name="password" 
                            label="Password" 
                            placeholder="Enter your password" 
                            type="password" 
                        />

                        <Button 
                            className="btn w-full" 
                            type="submit" 
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting 
                                ? (isSignIn ? 'Signing In...' : 'Creating Account...') 
                                : (isSignIn ? 'Sign In' : 'Create Account')
                            }
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No Account yet?' : 'Have an account already?'}
                    <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="text-user-primary font-bold ml-1">
                        {isSignIn ? 'Sign Up' : 'Sign In'}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;