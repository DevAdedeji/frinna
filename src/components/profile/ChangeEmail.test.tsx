import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { screen, render } from "@testing-library/react";
import toast from "react-hot-toast";
import { updateEmail } from "firebase/auth";
import IndexPage from "@/pages";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const mockedToastSuccess = vi.mocked(toast.success);
const mockedToastError = vi.mocked(toast.error);
const mockedToastLoading = vi.mocked(toast.loading);
const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedUpdateEmail = vi.mocked(updateEmail);

describe("Change Email", () => {
    beforeEach(() => {
        const mockUser = {
            uid: 'test-uid-123',
            displayName: 'oldUsername',
            email: "text@example.com"
        };
        vi.clearAllMocks();
        mockedUseAuthStore.mockReturnValue({ user: mockUser });
        mockedToastLoading.mockReturnValue("loading-test-id");
    })

    it("throws an error if old email is equal to new email", async () => {
        const user = userEvent.setup();
        render(<IndexPage />, { wrapper: BrowserRouter })
        await user.click(screen.getByRole("button", { name: "Change Email" }))

        const emailInput = screen.getByPlaceholderText("Email");
        await user.click(screen.getByRole("button", { name: "Change Email" }));

        expect(emailInput).toHaveValue("text@example.com");

        expect(mockedToastError).toHaveBeenCalledWith("No changes made.");
    })

    it("successfully change email", async () => {
        const user = userEvent.setup();
        render(<IndexPage />, { wrapper: BrowserRouter })
        await user.click(screen.getByRole("button", { name: "Change Email" }))

        const emailInput = screen.getByPlaceholderText("Email");
        await user.clear(emailInput);
        await user.type(emailInput, "email@example.com");
        await user.click(screen.getByRole("button", { name: "Change Email" }));

        await vi.waitFor(() => {
            expect(mockedUpdateEmail).toHaveBeenCalledTimes(1);
            expect(mockedToastSuccess).toHaveBeenCalledWith("Email changed successfully", { id: "loading-test-id" })
        })
    })
})
