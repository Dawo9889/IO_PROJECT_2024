import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect  } from "react";
import logo from './cupidlogo-white.svg'
import { useProfileContext } from '../context/ProfileContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const navigation = [
  { name: 'Admin Panel', href: '/admin', current: false },
  { name: 'Team', href: '/team', current: false },
  { name: 'Mobile App', href: '/mobile', current: false},
  { name: 'GitHub', href: 'https://github.com/Dawo9889/cupid-app', current: false}
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Navbar() {
    const { profileImage, updateProfileImage } = useProfileContext();
    const {auth} = useAuth()
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = () => {
      localStorage.removeItem("auth");
      setIsAuthenticated(false);
      navigate("/login");
    };

    const fetchProfileImage = () => {
        if (auth.accessToken === undefined) return;
    
        setProfileImageLoading(true);
        setError(null);
        axios
          .get(`${import.meta.env.VITE_API_URL}/identity/profile-picture`, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            responseType: 'arraybuffer',
          })
          .then((response) => {
            const binary = new Uint8Array(response.data);
            const binaryString = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
            const base64Image = btoa(binaryString);
            updateProfileImage(base64Image);
          })
          .catch(() => {})
          .finally(() => {
            setProfileImageLoading(false);
          });
      };

      useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        setIsAuthenticated(storedAuth ? true : false);
        fetchProfileImage();
      }, []);

  return (
    <Disclosure as="nav" className="bg-project-pink mb-4">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-project-pink-buttons hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
            <a
              href="/"
            >
              <img
                alt="Your Company"
                src={logo}
                className="h-8 w-auto"
                />
            </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-white text-white' : 'text-white hover:bg-project-pink-buttons hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!isAuthenticated ? 
            <a
            href={isAuthenticated ? "#" : "/login"}
            className="relative rounded-full bg-project-pink p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 font-medium"
            >
            {isAuthenticated ? "Logout" : "Login"}
            </a>
             : 
             <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="test"
                    src={profileImage ? `data:image/png;base64,${profileImage}` : '/login-photo.png'}
                    className="size-10 rounded-full outline outline-2 outline-project-blue"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute text-center right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    className="block px-2 py-2 text-sm text-gray-700 "
                  >
                    {isAuthenticated && auth && auth.user ? auth.user : ""}
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/settings"
                    className="block px-2 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    onClick={isAuthenticated ? handleLogout : null}
                    className="block px-2 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
             }
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-project-pink-buttons text-white' : 'text-white hover:bg-project-pink-buttons hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export default Navbar;