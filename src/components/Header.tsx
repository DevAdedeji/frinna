import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="flex items-center justify-center min-h-[60px]">
            <nav className="w-[90%] mx-auto flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <img src="/images/logo.png" className="size-[60px] object-cover" />
                    <p className="text-charcoal uppercase font-bold">FRINNA</p>
                </div>
                {/* <div>
                    <Button size={"sm"} className="w-[119px] text-sm font-bold text-[var(--foreground)]" asChild>
                        <NavLink to="/auth/signup">Sign Up</NavLink>
                    </Button>
                </div> */}
            </nav>
        </header>
    )
}

export default Header;