import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Input from "./Input";

describe("Input component", () => {
    it("toggle correctly", async () => {
        render(
            <Input placeholder="password" type="password" />
        )
        const inputElement = screen.getByPlaceholderText("password")
        const buttonElement = screen.getByLabelText("Show Password");
        await userEvent.click(buttonElement);
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute('type', 'text')
        expect(screen.getByLabelText("Hide Password")).toBeInTheDocument();
        await userEvent.click(buttonElement);
        expect(inputElement).toHaveAttribute('type', 'password')
    })

    it("display error message", () => {
        const errorMsg = "Must be 8 character"
        render(
            <Input error={errorMsg} placeholder="password" type="password" />
        )
        const errorElement = screen.getByText(errorMsg);
        expect(errorElement).toBeInTheDocument();
    })
})