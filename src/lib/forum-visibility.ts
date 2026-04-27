import { getAuth } from 'firebase/auth';
import {
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { hasStaffRole } from './support';

export interface ForumVisibilityState {
    publicVisible: boolean;
    postingEnabled: boolean;
}

export function subscribeForumVisibility(
    onData: (state: ForumVisibilityState) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const ref = doc(db, 'siteSettings', 'forum');
    return onSnapshot(
        ref,
        (snap) => {
            const data = snap.data() as Partial<ForumVisibilityState> | undefined;
            onData({
                publicVisible: data?.publicVisible === true,
                postingEnabled: data?.postingEnabled === true,
            });
        },
        (err) => onError?.(err),
    );
}

async function updateForumVisibilityState(nextState: Partial<ForumVisibilityState>): Promise<void> {
    const authUser = getAuth().currentUser;
    if (!authUser) {
        throw new Error('Authentication required');
    }

    const allowed = await hasStaffRole();
    if (!allowed) {
        throw new Error('Staff role required');
    }

    await setDoc(
        doc(db, 'siteSettings', 'forum'),
        {
            ...nextState,
            updatedAt: serverTimestamp(),
            updatedBy: authUser.uid,
        },
        { merge: true },
    );
}

export async function setForumPublicVisibility(publicVisible: boolean): Promise<void> {
    await updateForumVisibilityState({ publicVisible });
}

export async function setForumPostingEnabled(postingEnabled: boolean): Promise<void> {
    await updateForumVisibilityState({ postingEnabled });
}
