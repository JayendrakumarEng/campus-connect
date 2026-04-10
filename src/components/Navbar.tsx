import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, Compass, Bookmark, Settings, LogOut, Shield, GraduationCap, Sun, Moon, School, LayoutDashboard, Trophy, User, Menu, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import RoleBadge from '@/components/RoleBadge';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const isActive = (path: string) => location.pathname === path;

  const mainLinks = [
    { to: '/feed', label: 'Feed', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/success-stories', label: 'Stories', icon: Trophy },
    { to: '/college', label: 'College', icon: School },
  ];

  const staffLinks = (profile?.role === 'staff' || profile?.role === 'admin')
    ? [{ to: '/staff', label: 'Dashboard', icon: LayoutDashboard }]
    : [];

  const adminLinks = profile?.role === 'admin'
    ? [{ to: '/admin', label: 'Admin', icon: Shield }]
    : [];

  const allLinks = [...mainLinks, ...staffLinks, ...adminLinks];

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/feed" className="flex items-center gap-2.5 font-bold text-lg text-primary shrink-0 group">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline tracking-tight">Campus Connect</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {allLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(d => !d)}
              className="h-9 w-9 rounded-xl hover:bg-accent/50"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-border/50 hover:ring-primary/30 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to={`/profile/${user?.id}`} className="flex items-center gap-2.5 py-2">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link to="/settings" className="flex items-center gap-2.5 py-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2.5 py-2 text-destructive focus:text-destructive rounded-lg">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                {/* Profile card in drawer */}
                <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-accent/30">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-0.5">
                  {allLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(link.to)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <div className="my-2 border-t border-border/50" />
                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {mainLinks.slice(0, 5).map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive(link.to)
                  ? 'text-primary'
                  : 'text-muted-foreground active:scale-95'
              }`}
            >
              {isActive(link.to) && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <link.icon className={`h-5 w-5 ${isActive(link.to) ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive(link.to) ? 'font-semibold' : ''}`}>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
