import icon from '../images/snipscript_icon_transparent.png';
import logo from '../images/snipscript_logo_transparent.png';
import { Link } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  const [showDropdown, setShowDropdown] = useState(false);
  const [ activeLink, setActiveLink ] = useState('/');
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("Current username");
    localStorage.removeItem("Current user id");
    navigate('/authentication');
  };

  const user = localStorage.getItem("Current username");
  const loginButton = user ? `${user}` : 'Login';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard'},
    { name: 'Explore', href: '/explore'},
    { name: 'Bookmarks', href: '/bookmarks'},
    { name: loginButton, href: '/authentication'},
  ]

  function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
  }

    return (
      <nav className="p-4 bg-violet-900 bg-opacity-25">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={icon} alt="Icon" className="h-14 w-14 mr-5" />
            <img src={logo} alt="Logo" className="h-6" />
          </div>
  
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <React.Fragment key={item.name}>
              {item.name === user ? (
                <div className="relative ml-3" onClick={() => {setShowDropdown(!showDropdown); setActiveLink (item.href)}}>
                  <div>
                    <button
                      className={classNames(
                        item.href === activeLink ? 'bg-violet-100 text-black' : 'text-white hover:bg-violet-100 hover:text-black',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-expanded={showDropdown}
                      aria-haspopup="true"
                      aria-current={item.href === activeLink ? 'page' : undefined}
                    >
                      {item.name}
                    </button>
                  </div>
                  {showDropdown && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">
                        Your Profile
                      </a>
                      <a className="block px-4 py-2 text-sm text-gray-700 cursor-pointer" role="menuitem" tabIndex="-1" id="user-menu-item-2" onClick={handleSignOut}>
                        Sign out
                      </a>
                    </div>
                  )}
                </div>
              ) : 
                <Link
                to={item.href}
                className={classNames(
                  item.href === activeLink ? 'bg-violet-100 text-black' : 'text-white hover:bg-violet-100 hover:text-black',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={item.href === activeLink ? 'page' : undefined}
                onClick={() => {setActiveLink(item.href); setShowDropdown(false)}}
              >
                {item.name}
              </Link>
              }
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
    );
  };
  
