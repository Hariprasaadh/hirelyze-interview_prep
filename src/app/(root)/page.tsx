import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '../components/InterviewCard'
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
import SignOutButton from '../components/SignOutButton'


const page = async () => {

  const user = await getCurrentUser(); // Fetch the current user data


  // Parallelly fetch user interviews and latest interviews
  // Using Promise.all to run both fetches concurrently for better performance
  const [userInterviews, latestInterviews] = await Promise.all(
    [
      await getInterviewByUserId(user?.id || ''), // Fetch interviews for the user
      await getLatestInterviews( {userId: user?.id } ), // Fetch latest interviews
    ]
  );

 

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpComingInterviews = latestInterviews.length > 0;




  return (
    <div> 

      <div className="flex justify-between items-center mb-6 text-lg">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Hired Faster with AI-Powered Mock Interviews</h2>
          <p>Practise on real interview questions and get instant feedback</p>

          <Button asChild className='btn-primary max-sm:w-full'>
            {/* Use `asChild` to apply Button styles to a different element like a, div, or Link */}
            <Link href='/interview'>Start an Interview</Link>
          </Button>

        </div> 

        <Image src="/robot.png" alt="Robot" width={400} height={400} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
          <h2>Your Interviews</h2>

          <div className='interviews-section'>

            {
              hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview.id}/>
                ))
              ) : (
                <p>You have not taken any interviews yet.</p>
              ) 
            }

          </div>    

      </section> 

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interviews-section'>
            {
              hasUpComingInterviews ? (
                latestInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview.id}/>
                ))
              ) : (
                <p>There are no new interviews available.</p>
              ) 
            }

          </div>
          
      </section>
    </div>
  )
}

export default page
