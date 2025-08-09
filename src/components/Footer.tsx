const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-midnight min-h-[60px] py-4 flex flex-col gap-2 items-center justify-center text-center text-white">
            <p>©{year} Frinna</p>
            <p>Made with ❤ by Tewogbade Adedeji</p>
        </footer>
    )
}

export default Footer;