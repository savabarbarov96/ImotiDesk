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

interface TransparentNavbarProps {
  items: NavItem[]
  className?: string
  isDark?: boolean // Optional prop to toggle between light/dark text
  hideAuth?: boolean // Optional prop to hide authentication UI
}

export function TransparentNavbar({ items, className, isDark = false, hideAuth = false }: TransparentNavbarProps) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isAuthenticated = !!user
  const isAdmin = profile?.role === 'admin'
  const isAgent = (profile?.role as string) === 'agent'

  // Text color based on isDark prop with enhanced styling for better visibility
  const baseTextClass = isDark 
    ? "text-gray-200 font-medium" 
    : "text-gray-700 font-medium"
  
  const textColor = baseTextClass
  const hoverTextColor = isDark 
    ? "hover:text-white transition-all duration-300" 
    : "hover:text-black transition-all duration-300"
  
  const activeTextColor = isDark 
    ? "text-white font-medium" 
    : "text-black font-bold"

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

  // Add text shadow styles
  useEffect(() => {
    // Add custom CSS for text shadow
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes gentle-pulse {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 1; }
      }
      .nav-item-animated {
        position: relative;
        z-index: 1;
      }
      .nav-item-animated:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 25%;
        width: 50%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
      .nav-item-animated:hover:after {
        transform: scaleX(1);
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleSignout = async () => {
    await signOut()
    navigate("/auth")
  }

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[49]",
        location.pathname === "/" ? "bg-white" : "bg-gray-50",
        scrolled ? "h-16 shadow-sm border-b border-gray-200 bg-white" : "h-20",
        "transition-all duration-300"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto flex h-full items-center justify-between">
        {/* Left section with logo */}
        <div className="w-1/4 flex justify-start">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={cn(
                "w-auto rounded-2xl transition-all duration-300",
                scrolled ? "h-10" : "h-16"
              )}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Centered Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <div 
            className={cn(
              "relative z-50",
              className
            )}
          >
            <div className="flex items-center gap-3 py-1.5 px-3 rounded-full whitespace-nowrap">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.title

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setActiveTab(item.title)}
                    className={({ isActive }) => cn(
                      "relative cursor-pointer text-sm font-bold px-3 py-2 rounded-full transition-colors nav-item-animated",
                      !isActive && textColor,
                      !isActive && hoverTextColor,
                      isActive && activeTextColor
                    )}
                  >
                    {Icon && <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>}
                    <span className="hidden md:inline">{item.title}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>                {/* Right section with Authentication UI */}        <div className="w-1/4 flex justify-end">          {!hideAuth && (            <div className="hidden md:flex items-center space-x-2">              <Link to="/sell">                <Button                  variant="default"                  className="rounded-full bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all mr-2"                  size="sm"                >                  Продай сега                </Button>              </Link>              {isAuthenticated ? (              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-black"
                  >
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
                                </DropdownMenuContent>              </DropdownMenu>              ) : location.pathname === "/auth" ? null : (               <></>  )}            </div>          )}

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="sm:w-2/3 md:w-1/2 bg-black/90 backdrop-blur-lg border-0">
              <SheetHeader className="text-left">
                <SheetTitle className="text-white">Меню</SheetTitle>
                <SheetDescription className="text-white/70">Разгледайте нашите предложения.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `block p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                        isActive ? "text-white border-l-2 border-white pl-[6px]" : "text-gray-200 hover:text-white"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
                {isAuthenticated && !hideAuth ? (
                  <>
                    <NavLink to="/profile" className={({ isActive }) =>
                      `block p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                        isActive ? "text-white border-l-2 border-white pl-[6px]" : "text-gray-200 hover:text-white"
                      }`
                    }>
                      Профил
                    </NavLink>
                    {(isAdmin || isAgent) && (
                      <NavLink to="/management" className={({ isActive }) =>
                        `block p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                          isActive ? "text-white border-l-2 border-white pl-[6px]" : "text-gray-200 hover:text-white"
                        }`
                      }>
                        Управление на имоти
                      </NavLink>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-white border-white/20 hover:bg-white/10 hover:text-white" 
                      onClick={handleSignout}
                    >
                      Изход
                    </Button>
                  </>
                ) : location.pathname === "/auth" || hideAuth ? null : (
                  <>
                    <Link to="/sell">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full justify-center text-white bg-[#ff3366] hover:bg-[#ff3366]/90 rounded-full mb-2"
                      >
                        Продай сега
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile bottom nav bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 z-50">
        <div className="flex justify-between items-center max-w-full overflow-x-auto">
          {items.map((item) => {
            const Icon = item.icon || (() => null);
            const isActive = activeTab === item.title;
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setActiveTab(item.title)}
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center p-1.5 text-xs rounded-md min-w-0 flex-1",
                  isActive ? "text-black font-medium after:content-[''] after:block after:w-1/3 after:h-[2px] after:bg-black after:mt-1 after:mx-auto after:rounded-full" : "text-gray-500"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="mt-1 truncate text-[10px] leading-tight">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  )
} 