import React, { useState, useEffect } from "react";
import { Menu, X, Bell, User, Search, ChevronDown } from "lucide-react"; // Using lucide-react icons
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

// Type definitions
type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  submenu?: SubMenuItem[];
};

type SubMenuItem = {
  name: string;
  href: string;
  description?: string;
};

type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}


// Header Navigation Component
function HeaderNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sample user data
  const user: UserProfile = {
    name: "Tunmise Falodun",
    email: "ultimatefaloe@outlook.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Developer",
  };

  // Navigation items
  const navigation: NavItem[] = [
    // {
    //   name: 'Dashboard',
    //   href: '/dashboard',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    //     </svg>
    //   )
    // },
    {
      name: "Tasks",
      href: "/tasks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    // {
    //   name: 'Projects',
    //   href: '/projects',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    //     </svg>
    //   )
    // },
    // {
    //   name: 'Team',
    //   href: '/team',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.197v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    //     </svg>
    //   )
    // },
    // {
    //   name: 'Analytics',
    //   href: '/analytics',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //     </svg>
    //   )
    // }
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      text: 'Task "Design Homepage" is due tomorrow',
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      text: "New comment on Project Alpha",
      time: "1 hour ago",
      read: false,
    },
    { id: 3, text: "Weekly report is ready", time: "2 hours ago", read: true },
    { id: 4, text: "Team meeting at 3 PM", time: "Yesterday", read: true },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".profile-menu") &&
        !target.closest(".profile-button")
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        !target.closest(".notifications-menu") &&
        !target.closest(".notifications-button")
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const searchHandler = debounce((value: string) => {
    navigate({
      to: "/tasks",
      replace: true,
      search: (prev) => ({
        ...prev,
        search: value,
      }),
    });
  }, 500);

  // Navigation item component
  const NavItem = ({ item }: { item: NavItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = location.pathname === item.href;

    return (
      <div className="relative">
        <Link
          to={item.href}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
            ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            }
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
              {item.badge}
            </span>
          )}
          {item.submenu && (
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isHovered || isActive ? "rotate-180" : ""}`}
            />
          )}
        </Link>
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TanStack Tasks
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  onChange={(e)=>searchHandler(e.target.value)}
                  placeholder="Search tasks, projects..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative notifications-button">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="notifications-menu absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      You have {notifications.filter((n) => !n.read).length}{" "}
                      unread
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                      >
                        <p className="text-gray-900">{notification.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* <div className="p-4 border-t border-gray-200">
                    <Link
                      to="/notifications"
                      className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all notifications
                    </Link>
                  </div> */}
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative profile-button">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileMenuOpen && (
                <div className="profile-menu absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-50 text-gray-700"
                    >
                      <User className="w-5 h-5" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-50 text-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => console.log("Logging out...")}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 text-red-600 font-medium"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-2 pt-4 pb-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      location.pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="mt-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  onChange={(e)=>searchHandler(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderNavigation;
