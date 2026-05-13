const SteamAnimation = () => {
    return (
        <div className="steam-container">
            <svg className="steam-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path className="steam-path steam-path-1" d="M30 80 Q 40 50, 30 20 T 40 -10" fill="transparent" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
                <path className="steam-path steam-path-2" d="M50 85 Q 65 55, 50 25 T 60 -5" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                <path className="steam-path steam-path-3" d="M70 75 Q 55 45, 70 15 T 60 -15" fill="transparent" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default SteamAnimation;
