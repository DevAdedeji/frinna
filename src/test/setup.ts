import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";


// Mocking react-hot-toast
vi.mock("react-hot-toast", () => ({
    default: {
        loading: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    }
}))

vi.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    updateEmail: vi.fn(),
    updatePassword: vi.fn(),
    getAuth: vi.fn(),
    reauthenticateWithCredential: vi.fn(),
    EmailAuthProvider: {
        credential: vi.fn((email, password) => ({ email, password }))
    }
}));

vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    serverTimestamp: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn(),
    where: vi.fn(),
    query: vi.fn(),
    limit: vi.fn(),
}));

// Mock firebase config
vi.mock("@/firebase", () => ({
    auth: {},
    db: {},
}));

vi.mock("@/store/useAuthStore", () => ({
    useAuthStore: vi.fn(),
}));

vi.mock("@/hooks/useReauthenticate", () => ({
    useReauthenticate: vi.fn(),
}));

vi.mock(import("react-router-dom"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useParams: vi.fn(),
    }
});