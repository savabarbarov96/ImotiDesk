import React from 'react'
import { Home, User, Briefcase, FileText, Settings, Mail, BarChart, Search } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

export default function TubelightNavbarDemo() {
  // Example navbar items for different use cases
  const mainNavItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Projects', url: '#projects', icon: Briefcase },
    { name: 'Resume', url: '#resume', icon: FileText }
  ]

  const adminNavItems = [
    { name: 'Dashboard', url: '#dashboard', icon: BarChart },
    { name: 'Users', url: '#users', icon: User },
    { name: 'Settings', url: '#settings', icon: Settings },
    { name: 'Messages', url: '#messages', icon: Mail }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-start p-4 pt-24">
      <h1 className="text-4xl font-bold mb-8">Tubelight Navbar Component</h1>
      <p className="text-lg max-w-xl text-center mb-16">
        A modern navigation bar with a tubelight effect that animates between active items.
        Responsive design that collapses to icons on mobile devices.
      </p>
      
      {/* Primary example */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Main Navigation</h2>
        <div className="h-32 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl mb-16 relative">
          {/* A non-fixed version of the navbar for demonstration */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4">
            <NavBar items={mainNavItems} />
          </div>
        </div>
        
        {/* Admin example */}
        <h2 className="text-2xl font-bold mb-4">Admin Navigation</h2>
        <div className="h-32 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl mb-16 relative">
          {/* A non-fixed version of the navbar for demonstration */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4">
            <NavBar items={adminNavItems} />
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Animated "tubelight" effect that follows the active item</li>
          <li>Responsive design - collapses to icons on mobile</li>
          <li>Text labels on desktop, icon-only on mobile</li>
          <li>Customizable via props and Tailwind classes</li>
          <li>Built with Framer Motion for smooth animations</li>
        </ul>
      </div>
      
      <div className="mt-12 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Implementation</h2>
        <p className="mb-4">The component is implemented in <code className="bg-gray-700 px-2 py-1 rounded">src/components/ui/tubelight-navbar.tsx</code></p>
        <p className="mb-4">Usage example:</p>
        <pre className="bg-gray-700 p-4 rounded overflow-auto text-sm">
{`import { Home, User, Mail } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function MyNavigation() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Profile', url: '/profile', icon: User },
    { name: 'Contact', url: '/contact', icon: Mail }
  ]

  return <NavBar items={navItems} />
}`}
        </pre>
      </div>
      
      {/* To show the actual fixed component at the bottom of the page */}
      <NavBar 
        items={[
          { name: 'Documentation', url: '#docs', icon: FileText },
          { name: 'Examples', url: '#examples', icon: Search },
          { name: 'Features', url: '#features', icon: Settings },
          { name: 'Contact', url: '#contact', icon: Mail }
        ]}
        className="mb-8 sm:mb-0"
      />
    </div>
  )
} 