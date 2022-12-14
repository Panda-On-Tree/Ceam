import React from 'react'
import './Navbar.css'
import { SlButton, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react/index';
import logo from './logo2.png'
import { useNavigate } from 'react-router-dom';
function Navbar() {

    let navigate = useNavigate()

  return (
   <div className='navbar'>
 <div className='navbar-main'>
        <nav className='navbar-inner'>
            <div className='navbar-logo'>
                <img src={logo}  className='navbar-logo' alt="" />  
            </div>
            <h2 className='navbar-head'>Attendance Roster Management</h2>
            <div className='nav-items-main'>
            <SlDropdown distance={5} className="nav-item">
                <SlButton className='nav-item-button' slot="trigger" caret>
                    Services
                </SlButton>
                <SlMenu>
                <SlMenuItem  onClick={()=>{
                     navigate("/")
                }}>Attendance Roster</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/ot-roster")
                }}>OT Roster</SlMenuItem>
                <SlMenuItem onClick={()=>{
                     navigate("/plant-manage")
                }}>Manage Plant</SlMenuItem>
                </SlMenu>
            </SlDropdown> 
            <SlDropdown distance={5} className="nav-item">
                <SlButton className='nav-item-button' slot="trigger" caret>
                    Profile
                </SlButton>
                <SlMenu>
                <SlMenuItem onclick={()=>{
                     localStorage.clear()
                     navigate("/login")
                }}>LogOut</SlMenuItem>
              
                
                </SlMenu>
            </SlDropdown> 
            </div>
        </nav>
    </div>
   </div>
  )
}

export default Navbar