const LogoMark = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
        <path d="M10 18l5 5 11-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
        </defs>
    </svg>
);

export default LogoMark;
