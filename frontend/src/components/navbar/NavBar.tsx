import { Menu, UserIcon, LogOutIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import kittenImage from '../../assets/kitten.jpg';
import { DEFAULT_LOGO, DEFAULT_MENU, DEFAULT_AUTH } from '../../constants/NavBar.constants';
import { useAuth } from '@/context/AuthContext';
import { MenuItemDesktop } from './components/MenuItemDesktop';
import { MenuItemMobile } from './components/MenuItemMobile';
import { NavbarProps } from './types';

import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/NavigationMenu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const NavBar = ({ logo = DEFAULT_LOGO, menu = DEFAULT_MENU, auth = DEFAULT_AUTH, className }: NavbarProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, login, signup, logout } = useAuth();

  const handleAvatarClick = () => {
    // TODO: Fetch user profile data when auth is implemented
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className={cn('py-4', className)}>
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <MenuItemDesktop key={item.title} item={item} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={kittenImage} alt="Avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleAvatarClick}>
                      <UserIcon />
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={login}>
                  {auth.login.title}
                </Button>
                <Button size="sm" onClick={signup}>
                  {auth.signup.title}
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                    {menu.map((item) => (
                      <MenuItemMobile key={item.title} item={item} />
                    ))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {isAuthenticated ? (
                      <>
                        <Button asChild>
                          <Link to="/profile">Profile</Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={login}>
                          {auth.login.title}
                        </Button>
                        <Button onClick={signup}>{auth.signup.title}</Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { NavBar };
