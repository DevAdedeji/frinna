import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { screen, render } from "@testing-library/react";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import IndexPage from "@/pages";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const mockedGetDoc = vi.mocked(getDoc);
const mockedSetDoc = vi.mocked(setDoc);
const mockedToastSuccess = vi.mocked(toast.success);
const mockedToastError = vi.mocked(toast.error);
const mockedToastLoading = vi.mocked(toast.loading);
const mockedUpdateProfile = vi.mocked(updateProfile);
const mockedUseAuthStore = vi.mocked(useAuthStore);

describe("Change username", () => {
    beforeEach(() => {
        const mockUser = {
            uid: 'test-uid-123',
            displayName: 'oldUsername',
        };
        vi.clearAllMocks();
        mockedUseAuthStore.mockReturnValue({ user: mockUser });
        mockedToastLoading.mockReturnValue("loading-test-id");
    })
    it("throws an error if old username is equal to new username", async () => {
        const user = userEvent.setup();
        render(<IndexPage />, { wrapper: BrowserRouter })

        await user.click(screen.getByRole("button", { name: "Change Username" }))
        const usernameInput = screen.getByPlaceholderText("Username");
        await user.click(screen.getByRole("button", { name: "Change Username" }))

        expect(usernameInput).toHaveValue("oldUsername");
        expect(mockedToastError).toHaveBeenCalledWith("No changes made.");
    })

    it("throws an error is username is already taken", async () => {
        const user = userEvent.setup();
        mockedGetDoc.mockResolvedValue({ exists: () => true } as any);

        render(<IndexPage />, { wrapper: BrowserRouter })

        await user.click(screen.getByRole("button", { name: "Change Username" }))

        const usernameInput = screen.getByPlaceholderText("Username");
        await user.clear(usernameInput);
        await user.type(usernameInput, "Mayowa");
        await user.click(screen.getByRole("button", { name: "Change Username" }));

        expect(mockedGetDoc).toHaveBeenCalledTimes(1);
        expect(mockedToastError).toHaveBeenCalledWith("The username is already taken", { id: "loading-test-id" })
    });

    it("successfully change user username", async () => {
        const user = userEvent.setup();
        mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

        render(<IndexPage />, { wrapper: BrowserRouter })

        await user.click(screen.getByRole("button", { name: "Change Username" }))

        const usernameInput = screen.getByPlaceholderText("Username");
        await user.clear(usernameInput);
        await user.type(usernameInput, "Mayowa");
        await user.click(screen.getByRole("button", { name: "Change Username" }));
        expect(mockedGetDoc).toHaveBeenCalledTimes(1);
        expect(mockedSetDoc).toHaveBeenCalledTimes(1);
        expect(mockedUpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockedUpdateProfile).toHaveBeenCalledTimes(1);
        expect(deleteDoc).toHaveBeenCalledTimes(1);
        await vi.waitFor(() => {
            expect(mockedToastSuccess).toHaveBeenCalledWith("Username changed successfully", { id: "loading-test-id" });
        })
    })
})