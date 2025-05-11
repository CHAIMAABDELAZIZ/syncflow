import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

// The component doesn't include the Bell button since it's already in your Navbar
export default function NotificationsSidebar({ isOpen, setIsOpen }) {
  const notifications = [
    {
      id: 1,
      title: "Notification or alert title",
      type: "error",
      backgroundColor: "bg-red-50",
      borderColor: "border-l-4 border-red-500",
      icon: <AlertCircle className="w-6 h-6 text-red-500" />
    },
    {
      id: 2,
      title: "Custom Code is not Valid",
      description: "Incorrect code may impact je sais pas quoi mdr",
      type: "warning",
      backgroundColor: "bg-white",
      borderColor: "",
      isDismissable: true,
      icon: <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-gray-600" />
            </div>
    },
    {
      id: 3,
      title: "Notification or alert title",
      type: "warning",
      backgroundColor: "bg-yellow-50",
      borderColor: "border-l-4 border-yellow-500",
      icon: <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
    },
    {
      id: 4,
      title: "Notification or alert title",
      type: "warning",
      backgroundColor: "bg-yellow-50",
      borderColor: "border-l-4 border-yellow-500",
      icon: <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
    },
    {
      id: 5,
      title: "Notification or alert title",
      type: "error",
      backgroundColor: "bg-red-50",
      borderColor: "border-l-4 border-red-500",
      icon: <AlertCircle className="w-6 h-6 text-red-500" />
    },
    {
      id: 6,
      title: "Notification or alert title",
      type: "success",
      backgroundColor: "bg-green-50",
      borderColor: "border-l-4 border-green-500",
      icon: <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
    }
  ];

  const [notificationsState, setNotificationsState] = useState(notifications);

  const dismissNotification = (id) => {
    setNotificationsState(notificationsState.filter(notif => notif.id !== id));
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Notifications sidebar */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-blue-500 text-sm hover:underline">Mark all as read</a>
              <button 
                onClick={closeSidebar}
                className="p-1 rounded-full bg-transparent border-none hover:bg-gray-100 focus:outline-none"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notificationsState.map((notification) => (
              <div 
                key={notification.id} 
                className={`${notification.backgroundColor} ${notification.borderColor}`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{notification.title}</h3>
                      {notification.description && (
                        <p className="text-gray-500 text-sm mt-1">{notification.description}</p>
                      )}
                      
                      {notification.isDismissable ? (
                        <div className="mt-3">
                          <button 
                            onClick={() => dismissNotification(notification.id)}
                            className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-700"
                          >
                            Ok, I got it
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center">
                          <button className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 mr-2 text-gray-700">
                            View the data
                          </button>
                          <a href="#" className="text-gray-500 text-sm hover:underline mt-1">Maybe later</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <a href="/alerts" className="text-blue-500 hover:underline w-full text-center block">
              See all
            </a>
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}