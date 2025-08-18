import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom";

import Button from "./Button";

describe("Button component", () => {
    it("should render button with correct test", () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: 'Click Me' });
        expect(buttonElement).toBeInTheDocument();
    })
    it("should call the onclick handler when clicked", async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: 'Click Me' });
        await userEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalled();
    })
    it("should be disabled if disabled attribute is set to true", () => {
        const disabled = true;
        render(<Button disabled={disabled}>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: 'Click Me' });
        expect(buttonElement).toBeDisabled();
    })
    it("renders as a link if href is passed", () => {
        const href = "/auth/signin";
        render(
            <BrowserRouter>
                <Button href={href}>Click Me</Button>
            </BrowserRouter>
        );
        const buttonElement = screen.getByRole('link', { name: 'Click Me' });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveAttribute('href')
    })
})