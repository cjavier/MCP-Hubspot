import { MenuIcon, XIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { 
  HomeIcon, 
  UsersIcon, 
  InboxIcon, 
  BarChartIcon, 
  SettingsIcon 
} from "lucide-react";

interface MobileNavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileNavbar({ isOpen, setIsOpen }: MobileNavbarProps) {
  const [location] = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Contacts', href: '/contacts', icon: UsersIcon },
    { name: 'Tasks', href: '#', icon: InboxIcon },
    { name: 'Analytics', href: '#', icon: BarChartIcon },
    { name: 'Settings', href: '#', icon: SettingsIcon },
  ];

  return (
    <>
      <div className="md:hidden bg-white border-b border-gray-200 fixed inset-x-0 top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-primary-800">HubSpot MCP Server</h1>
          <button 
            type="button" 
            className="rounded-md p-2 text-gray-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden pt-16">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive 
                        ? "bg-primary-50 text-primary-700" 
                        : "text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon 
                      className={`mr-3 h-6 w-6 ${
                        isActive 
                          ? "text-primary-600" 
                          : "text-gray-500 group-hover:text-primary-600"
                      }`} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700">Admin User</p>
                  <p className="text-sm font-medium text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
