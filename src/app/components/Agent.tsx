import Image from "next/image"
import { cn } from "@/lib/utils" // 

enum CallStatus {  //allows us to define multiple values
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const Agent = ({userName} : AgentProps) => {

  const isSpeaking = true;
  const callStatus = CallStatus.FINISHED;
  const messages = [
    'Whats your name?',
    'My Name is John Doe, nice to meet you.',
  ]

  const lastMessage = messages[messages.length -1];

  return (
    <div>
      <div className="call-view">

        <div className="card-interviewer">

          <div className="avatar">
            <Image src='/logo.png' alt='vapi' width={95} height={54} className="object-cover rounded-full"></Image>
            {isSpeaking && <span className="animate-speak"></span>}
          </div>

          <h3>AI Interviewer</h3>

        </div>
         
        <div className="card-border">

          <div className="card-content">

            <Image src='/user-avatar.png' alt='user avatar' width={540} height={540} className="rounded-full object-cover size-[120px]" />
            <h3>{userName}</h3>

          </div>

        </div>
      </div>

      {messages.length>0 && (

        <div className="transcript-border mt-2">
          <div className="transcript">

              <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                {lastMessage}
              </p>

          </div>
        </div>
      )}  

      <div className="w-full flex justify-center mt-2">
          {callStatus !== 'ACTIVE' ? (
            <button className="relative btn-call">
              <span className={cn('absolute animate-pint rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}>
                {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '....'}
              </span>

              <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED"
                    ? "Call"
                    : ". . ."}
              </span>

            </button>
          ) : (
            <button className="btn-disconnect">
              End Call
            </button>
          ) }
      </div>
    </div>
  )
}

export default Agent
