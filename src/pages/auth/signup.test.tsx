import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import toast from "react-hot-toast";
import { getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
})


import SignUpPage from "./signup";


const mockedCreateUser = vi.mocked(createUserWithEmailAndPassword);
const mockedUpdateProfile = vi.mocked(updateProfile);
const mockedGetDoc = vi.mocked(getDoc);
const mockedSetDoc = vi.mocked(setDoc);
const mockedToastSuccess = vi.mocked(toast.success);
const mockedToastError = vi.mocked(toast.error);
const mockedToastLoading = vi.mocked(toast.loading);


describe("signup page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it("should allow a new user to sign up successfully", async () => {
        const user = userEvent.setup();
        mockedGetDoc.mockResolvedValue({ exists: () => false } as any);
        mockedCreateUser.mockResolvedValue({ user: { uid: "123", email: "test@example.com", displayName: "textusername" } } as any)

        mockedToastLoading.mockReturnValue("loading-test-id");

        render(<SignUpPage />, { wrapper: BrowserRouter });

        await user.type(screen.getByPlaceholderText("Email Address"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Username"), "textusername");
        await user.type(screen.getByPlaceholderText("Password"), "Password123");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));


        await vi.waitFor(() => {
            expect(mockedCreateUser).toHaveBeenCalledTimes(1)
        })


        expect(mockedGetDoc).toHaveBeenCalledTimes(1);
        expect(mockedCreateUser).toHaveBeenCalledWith(expect.any(Object), "test@example.com", "Password123")
        expect(mockedUpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockedSetDoc).toHaveBeenCalledTimes(2);
        expect(mockedToastSuccess).toHaveBeenCalledWith("Account created successfully", { id: "loading-test-id" });
        expect(mockNavigate).toHaveBeenCalledWith("/");
    })
    it("should show an error if username is already taken", async () => {
        const user = userEvent.setup();
        mockedGetDoc.mockResolvedValue({ exists: () => true } as any);
        mockedCreateUser.mockResolvedValue({ user: { uid: "123", email: "test@example.com", displayName: "textusername" } } as any)
        render(<SignUpPage />, { wrapper: BrowserRouter });
        mockedToastLoading.mockReturnValue("loading-test-id");

        await user.type(screen.getByPlaceholderText("Email Address"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Username"), "textusername");
        await user.type(screen.getByPlaceholderText("Password"), "Password123");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));


        expect(mockedGetDoc).toHaveBeenCalledTimes(1);
        expect(mockedToastError).toHaveBeenCalledWith("Username is already taken. Please choose another.", { id: "loading-test-id" })
    })
})