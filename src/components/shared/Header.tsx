import React from 'react';

type HeaderProps = {
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
};

function Header({ setIsSidebarCollapsed, isSidebarCollapsed }: HeaderProps) {
  const sidebarWidth = isSidebarCollapsed ? 'w-[calc(100vw_-_60px)]' : 'w-[calc(100vw_-_250px)]';

  return (
    <header
      className={`fixed top-0 z-20 flex items-center justify-between pl-4 pr-8  py-2 border-b-2 bg-black text-white transition-all duration-300 ${sidebarWidth} `}
    >
      <button
        onClick={() => setIsSidebarCollapsed(prev => !prev)}
        className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        Toggle Sidebar
      </button>
      <h1 className="text-lg font-semibold">Header Component</h1>
    </header>
  );
}

export default Header;
