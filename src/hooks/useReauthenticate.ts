import { reauthenticateWithCredential, EmailAuthProvider, getAuth } from "firebase/auth";

export const useReauthenticate = () => {
    const auth = getAuth();

    const reauthenticate = async (password: string) => {
        if (!auth.currentUser || !auth.currentUser.email) {
            throw new Error("")
        }
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential)
    }

    return { reauthenticate };
}