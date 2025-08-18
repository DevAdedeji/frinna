import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import SignInPage from "./signin";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const mockedToastSuccess = vi.mocked(toast.success);
const mockedToastLoading = vi.mocked(toast.loading);
const mockedToastError = vi.mocked(toast.error);
const mockedSignIn = vi.mocked(signInWithEmailAndPassword);

describe("sign in page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it("successfull sign in", async () => {
        const user = userEvent.setup();

        mockedToastLoading.mockReturnValue("loading-test-id");

        render(<SignInPage />, { wrapper: BrowserRouter })

        await user.type(screen.getByPlaceholderText("Email Address"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Password"), "Password123");
        await user.click(screen.getByRole('button', { name: "Sign In" }));

        await vi.waitFor(() => {
            expect(mockedSignIn).toHaveBeenCalledTimes(1);
        })

        expect(mockedSignIn).toHaveBeenCalledWith(expect.any(Object), "test@example.com", "Password123");
        expect(mockedToastLoading).toHaveBeenCalledWith("Signing you in....");
        expect(mockedToastSuccess).toHaveBeenCalledWith("Welcome back", { id: "loading-test-id" });
    })
    it("Failed sign in", async () => {
        const user = userEvent.setup();

        mockedToastLoading.mockReturnValue("loading-test-id");
        mockedSignIn.mockRejectedValue(new Error("Firebase: Error (auth/wrong-password)."))

        render(<SignInPage />, { wrapper: BrowserRouter })

        await user.type(screen.getByPlaceholderText("Email Address"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Password"), "Password123");
        await user.click(screen.getByRole('button', { name: "Sign In" }));

        await vi.waitFor(() => {
            expect(mockedSignIn).toHaveBeenCalledTimes(1);
        })
        expect(mockedToastLoading).toHaveBeenCalledWith("Signing you in....");
        expect(mockedToastError).toHaveBeenCalledWith("Error (auth/wrong-password).", { id: "loading-test-id" });
    })
})