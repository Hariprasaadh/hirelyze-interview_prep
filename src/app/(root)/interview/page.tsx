import Agent from "@/app/components/Agent"
import { getCurrentUser } from "@/lib/actions/auth.action"

const page = async () => {

  const user = await getCurrentUser();
  return (
    <div>
      <h3>Interview Generation</h3>
      <Agent userName = {user?.name} userId={user?.id} type="generate"></Agent>
    </div>
  )
}

export default page
