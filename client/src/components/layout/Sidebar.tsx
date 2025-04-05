import { Link, useLocation } from "wouter";
import { 
  HomeIcon, 
  UsersIcon, 
  InboxIcon, 
  BarChartIcon, 
  SettingsIcon 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Contacts', href: '/contacts', icon: UsersIcon },
    { name: 'Tasks', href: '#', icon: InboxIcon },
    { name: 'Analytics', href: '#', icon: BarChartIcon },
    { name: 'Settings', href: '#', icon: SettingsIcon },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-800">HubSpot MCP Server</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 ${
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
      </div>

      {/* User Info */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs font-medium text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
