import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoClose, IoMenu } from 'react-icons/io5';
import { SidebarData } from './SidebarData';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <IoMenu onClick={showSidebar} />
        </Link>
        <div className="navbar-title">
          <h2>Sistema Agrícola IoT</h2>
        </div>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <IoClose />
            </Link>
            <div className="sidebar-header">
              <h3>Navegación</h3>
            </div>
          </li>
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;