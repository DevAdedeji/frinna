const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[var(--secondary)] min-h-[60px] py-4 flex flex-col gap-2 items-center justify-center text-center text-[var(--foreground)]">
            <p>©{year} Frinna</p>
            <p>Made with ❤ by Tewogbade Adedeji</p>
        </footer>
    )
}

export default Footer;