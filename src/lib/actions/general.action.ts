import { db } from "../../../firebase/admin";



// Action to get interviews by user ID
export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
    
    const interviews = await db.collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();  

    // map the documents to Interview type
    return interviews.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
    })) as Interview[]; // return as Interview array
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    
    const interview = await db.collection('interviews')
        .doc(id)
        .get();
    
    return interview.data() as Interview | null; // return as Interview or null if not found
}

    



export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    
    const { userId, limit = 10 } = params;
    
    const interviews = await db.collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .get();  

    // map the documents to Interview type
    return interviews.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
    })) as Interview[]; // return as Interview array
}