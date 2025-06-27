import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '../../../constants'
import InterviewCard from '../components/InterviewCard'

const page = () => {
  return (
    <div> 
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Hired Faster with AI-Powered Mock Interviews</h2>
          <p>Practise on real interview questions and get instant feedback</p>

          <Button asChild className='btn-primary max-sm:w-full'>
            {/* Use `asChild` to apply Button styles to a different element like a, div, or Link */}
            <Link href='/interviews'>Start an Interview</Link>
          </Button>

        </div>

        <Image src="/robot.png" alt="Robot" width={400} height={400} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
          <h2>Your Interviews</h2>

          <div className='interviews-section'>
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id}/>
            ))}

            {/* <p>You have not taken any interviews yet.</p> */}
          </div>    

      </section> 

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interviews-section'>
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id}/>
            ))}

            {/* <p>You have not taken any interviews yet.</p> */}
          </div>
          
      </section>
    </div>
  )
}

export default page
