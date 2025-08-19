import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import MessageUserPage from "./index";
import { addDoc, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

const mockedAddDoc = vi.mocked(addDoc);
const mockedToastSuccess = vi.mocked(toast.success);
const mockedToastError = vi.mocked(toast.error);
const mockedToastLoading = vi.mocked(toast.loading);
const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedUseParams = vi.mocked(useParams);
const mockedGetDocs = vi.mocked(getDocs);

describe("Message user page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedToastLoading.mockReturnValue("loading-test-id");
        mockedUseAuthStore.mockReturnValue({ user: null })
    })

    it("should send the message successfully", async () => {
        const user = userEvent.setup();
        mockedUseParams.mockReturnValue({ username: "user-123" });
        const mockRecipientId = "recipient-id-123";
        mockedGetDocs.mockResolvedValue({
            empty: false,
            docs: [{ id: mockRecipientId }]
        } as any)
        mockedAddDoc.mockResolvedValue({} as any);
        render(<MessageUserPage />, { wrapper: BrowserRouter });
        expect(screen.getByText(/send a message to user/i)).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText("Type in your message"), "Hello, this is a test message");
        await user.click(screen.getByRole("button", { name: "Send Message" }));

        await waitFor(() => {
            expect(mockedAddDoc).toHaveBeenCalled();
        });
        expect(mockedToastLoading).toHaveBeenCalledWith("Sending your message...");
        expect(mockedToastSuccess).toHaveBeenCalledWith("Message sent successfully", { id: "loading-test-id" });
    })

    it("should handle user not found", async () => {
        const user = userEvent.setup();
        mockedUseParams.mockReturnValue({ username: "user-123" });
        mockedGetDocs.mockResolvedValue({
            empty: true,
            docs: []
        } as any)
        render(<MessageUserPage />, { wrapper: BrowserRouter });
        expect(screen.getByText(/send a message to user/i)).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText("Type in your message"), "Hello, this is a test message");
        await user.click(screen.getByRole("button", { name: "Send Message" }));
        await waitFor(() => {
            expect(mockedAddDoc).not.toHaveBeenCalled();
        });
        expect(mockedToastError).toHaveBeenCalledWith("User not found");
    })
})