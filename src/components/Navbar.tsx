import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, Compass, Bookmark, Settings, LogOut, Shield, GraduationCap, Sun, Moon, School } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/feed" className="flex items-center gap-2 font-bold text-lg text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="hidden sm:inline">Campus Connect</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/feed" className={navLinkClass('/feed')}>
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Feed</span>
          </Link>
          <Link to="/explore" className={navLinkClass('/explore')}>
            <Compass className="h-4 w-4" />
            <span className="hidden md:inline">Explore</span>
          </Link>
          <Link to="/bookmarks" className={navLinkClass('/bookmarks')}>
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline">Bookmarks</span>
          </Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" className={navLinkClass('/admin')}>
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(d => !d)}
            className="h-9 w-9"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
