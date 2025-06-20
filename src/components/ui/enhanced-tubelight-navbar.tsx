import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { LucideIcon, Menu, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "/aa.logo.png"

interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
}

interface EnhancedNavBarProps {
  items: NavItem[]
  className?: string
}

export function EnhancedTubelightNavbar({ items, className }: EnhancedNavBarProps) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isAuthenticated = !!user
  const isAdmin = profile?.role === 'admin'
  const isAgent = profile?.role === 'agent'

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Set active tab based on current location
  useEffect(() => {
    const path = location.pathname
    const matchingItem = items.find(item => 
      item.href === path || 
      (item.href !== '/' && path.startsWith(item.href))
    )
    if (matchingItem) {
      setActiveTab(matchingItem.title)
    } else if (items.length > 0) {
      setActiveTab(items[0].title)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Add padding to body for navbar spacing
    document.body.style.paddingTop = '1rem';
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      document.body.style.paddingBottom = e.matches ? '4rem' : '0';
    };
    
    // Initial check
    handleMediaChange(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      document.body.style.paddingTop = '';
      document.body.style.paddingBottom = '';
    };
  }, []);

  const handleSignout = async () => {
    await signOut()
    navigate("/auth")
  }

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled && !isHovered ? "bg-white/50 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm",
        "border-b border-gray-200 shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-32 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-lg"
            style={{ maxHeight: '128px', objectFit: 'contain', marginTop: '10px', marginBottom: '10px' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div 
            className={cn(
              "relative z-50",
              className
            )}
          >
            <div className="flex items-center gap-2 bg-background/5 backdrop-blur-lg py-1 px-1 rounded-full">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.title

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setActiveTab(item.title)}
                    className={({ isActive }) => cn(
                      "relative cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-colors",
                      "text-gray-700 hover:text-primary",
                      isActive && "text-primary font-medium"
                    )}
                  >
                    {Icon && <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>}
                    <span className="hidden md:inline">{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-lamp"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-primary rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Authentication UI */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  <span className="max-w-[150px] truncate">{profile?.full_name || user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Моят акаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/profile')}>
                  Профил
                </DropdownMenuItem>
                {(isAdmin || isAgent) && (
                  <DropdownMenuItem onSelect={() => navigate('/management')}>
                    Управление на имоти
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignout}>
                  Изход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : location.pathname === "/auth" ? null : (
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/auth">
              <Button
                variant="secondary"
                className="bg-primary hover:bg-primary-dark text-white font-medium shadow-md hover:shadow-lg transition-all"
                size="sm"
              >
                Вход
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="sm:w-2/3 md:w-1/2">
            <SheetHeader className="text-left">
              <SheetTitle>Меню</SheetTitle>
              <SheetDescription>Разгледайте нашите предложения.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `block p-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-primary border-l-2 border-primary pl-[6px]" : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" className={({ isActive }) =>
                    `block p-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-primary border-l-2 border-primary pl-[6px]" : "text-gray-700 hover:text-primary"
                    }`
                  }>
                    Профил
                  </NavLink>
                  {(isAdmin || isAgent) && (
                    <NavLink to="/management" className={({ isActive }) =>
                      `block p-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive ? "text-primary border-l-2 border-primary pl-[6px]" : "text-gray-700 hover:text-primary"
                      }`
                    }>
                      Управление на имоти
                    </NavLink>
                  )}

                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignout}>
                    Изход
                  </Button>
                </>
              ) : location.pathname === "/auth" ? null : (
                <Link to="/auth">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start bg-primary text-white hover:bg-primary-dark shadow-md"
                  >
                    Вход
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
} 