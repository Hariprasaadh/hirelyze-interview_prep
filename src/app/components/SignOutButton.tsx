'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const SignOutButton = () => {
  const router = useRouter()

  async function handleSignOut() {
    try {
      const result = await signOut();
      
      if (result.success) {
        toast.success('Successfully signed out!');
        setTimeout(() => {
          router.push('/sign-in');
        }, 1000); // Small delay to show the toast
      } else {
        toast.error('Failed to sign out. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while signing out.');
    }
  }

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  )
}

export default SignOutButton