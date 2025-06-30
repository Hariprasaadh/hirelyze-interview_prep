'use client'

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk"; // Importing the VAPI SDK
import { interviewer } from "../../../constants";

enum CallStatus {  // This enum represents the different states of the call
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {  // This interface represents a message that has been saved in the conversation
  role: 'user' | 'assistant' | 'system';
  content: string;
}



const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages(prev => [...prev, newMessage]);
      }
    }

    const onSpeechStart = () => {
      setIsSpeaking(true);
    }

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    }

    const onError = (error: Error) => {
      console.error("Error during call:", error);
      setCallStatus(CallStatus.INACTIVE);
      setIsSpeaking(false);
    }

    // Listen for VAPI events
    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      // Cleanup event listeners on unmount
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generating feedback for messages");

    const { success, id } = {
      success: true,
      id: 'feedback-id-12345', // Mocked feedback ID
    }

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.error("Failed to generate feedback");
      router.push('/');
    }
  }

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, router, interviewId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === 'generate') {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        }
      });
    } else {
      let formattedQuestions = '';
      if (questions && questions.length > 0) {
        formattedQuestions = questions.map((question) => ` - ${question}`).join('\n');
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        }
      });
    }
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src='/logo.png' alt='vapi' width={95} height={54} className="object-cover rounded-full" />
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

      {messages.length > 0 && (
        <div className="transcript-border mt-2">
          <div className="transcript">
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-3">
        {callStatus !== 'ACTIVE' ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span className={cn('absolute animate-pint rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '....'}
            </span>
            <span className="relative">
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Call
          </button>
        )}
      </div>
    </div>
  )
}

export default Agent