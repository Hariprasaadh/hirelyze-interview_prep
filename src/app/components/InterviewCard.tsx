import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons'
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({ id , userId, role, type, techstack, createdAt} : InterviewCardProps) => {

  const feedback = userId && id ? await getFeedbackByInterviewId({ interviewId: id, userId }) : null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type; //regular expression to normalize a value
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
            <div>
                 <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                    <p className='bagde-text'>{normalizedType}</p>
                 </div>

                 <Image src={getRandomInterviewCover()} alt='Company Logo' width={90} height={90} className='rounded-full object-fit size-[90px]' />

                 <h3 className='mt-5 capitalize'>{role} Interview</h3>

                 <div className='flex flex-row gap-5 mt-3'>

                    <div className='flex flex-row gap-2'>
                        <Image src='/calendar.svg' alt='calendar' width={22} height={22} />
                        <p>{formattedDate}</p>
                    </div>

                    <div className='flex flex-row gap-2 items-center'>
                        <Image src='/star.svg' alt='star' width={22} height={22} />
                        <p>{feedback?.totalScore || '---'}/100</p>
                    </div> 

                 </div>

                 <p className='line-clamp-2'>{feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills"}</p>
            </div>

            <div className='flex flex-row justify-between '>

                <DisplayTechIcons techStack={techstack} />


                <Link href={feedback ? `/interview/${id}/feedback`: `/interview/${id}`}>
                    <Button className='btn-primary'>
                        {feedback ? 'Check Feedback' : 'Take Interview'}
                    </Button>
                </Link>
            </div>
      </div>
    </div> 
  )
}
 
export default InterviewCard
