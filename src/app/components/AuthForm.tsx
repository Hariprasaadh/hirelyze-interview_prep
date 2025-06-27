"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import FormField from "./FormField"


const authFormScheme = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    })
}


const AuthForm = ({type} : { type: FormType}) => {
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
    function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === "sign-up") {    
                console.log("SIGN UP", values);
            } else if(type === "sign-in") {
                console.log("SIGN IN", values);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong, please try again later.");
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
                    <FormField control={form.control} name="name" label="Name" placeholder="Enter your name" type="text" />
                )}
                <FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
                <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />

                <Button className="btn" type="submit">{isSignIn? 'Sign In':'Create an Account'}</Button>
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
  )
}

export default AuthForm
