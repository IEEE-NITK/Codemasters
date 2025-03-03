import React, { useState } from 'react';
import { Menu, X, ChevronDown, Code, Terminal, Users, BookOpen, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Code className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">CodeMasters</span>
              <span className="ml-1 text-blue-400 font-semibold">IEEE NITK</span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/questions" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Terminal className="w-4 h-4 mr-1" />
                Home
              </a>

              <a href="/editor" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium">Real-Time Editor</a>

              {/* Programs dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('programs')}
                  className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Programs
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {activeDropdown === 'programs' && (
                  <div className="absolute z-10 -ml-4 mt-1 transform w-56 rounded-md shadow-lg bg-white">
                    <div className="rounded-md bg-gradient-to-br from-blue-800 to-black shadow-xs py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Competitive Coding</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Web Development</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">App Development</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Machine Learning</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Events dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('events')}
                  className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Events
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {activeDropdown === 'events' && (
                  <div className="absolute z-10 -ml-4 mt-1 transform w-56 rounded-md shadow-lg bg-white">
                    <div className="rounded-md bg-gradient-to-br from-blue-800 to-black shadow-xs py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Hackathons</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Workshops</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Webinars</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-100 hover:bg-blue-700">Competitions</a>
                    </div>
                  </div>
                )}
              </div>

              <a href="#" className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Team
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-900 to-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/questions" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">Home</a>
            
            <button 
              onClick={() => toggleDropdown('mobilePrograms')}
              className="text-white w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 flex justify-between items-center"
            >
              Programs
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'mobilePrograms' && (
              <div className="pl-4 space-y-1">
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Competitive Coding</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Web Development</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">App Development</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Machine Learning</a>
              </div>
            )}
            
            <button 
              onClick={() => toggleDropdown('mobileEvents')}
              className="text-white w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 flex justify-between items-center"
            >
              Events
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'mobileEvents' && (
              <div className="pl-4 space-y-1">
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Hackathons</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Workshops</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Webinars</a>
                <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">Competitions</a>
              </div>
            )}
            
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">Team</a>
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">Resources</a>
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">Contact</a>
            
            <div className="pt-2">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                Join Us
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;