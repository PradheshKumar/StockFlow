const AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk0aab96-42liOmJ650hbJEach5R1nhilYO3sJcYkKUY5gC60CamIfn3YNOEbfodmwmGKWfGU0IqaO3ysGByTkXyYflIWCyXUZ5V91qotPiua6I4TVzLfe2GaiSCmAlOh8gH_wPtQzJUQERXC19drJbmNSEYga0UQ-ud8UhPG4bt7nM0YXCUgbKe1ayWaqUd_TXNTnnNqE1ma0DjM6-nT703hzK-tIyA2Ww3EUOV3ztDoTCaZy99JT0eALAZZY0dJgDrtVgR8az9uN';

export default function TopBar({ title, children }) {
  return (
    <header className="flex justify-between items-center h-16 px-lg bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-md">
        <h2 className="text-headline-lg font-black text-on-surface">{title}</h2>
        {children}
      </div>
      <div className="flex items-center gap-md">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
          <img src={AVATAR} alt="User profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
