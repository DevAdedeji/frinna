import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="flex items-center justify-center min-h-[60px]">
            <nav className="w-[90%] mx-auto flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <img src="/images/logo.png" className="size-[60px] object-cover" />
                    <p className="text-charcoal uppercase font-bold">FRINNA</p>
                </div>
                <NavLink to="/auth/signup" className={"h-[44px] bg-sky-blue rounded-[10px] w-[119px] text-sm font-bold flex items-center justify-center text-white"}>Sign Up</NavLink>
            </nav>
        </header>
    )
}

export default Header;