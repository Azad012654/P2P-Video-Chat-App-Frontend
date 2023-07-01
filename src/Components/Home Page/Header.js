import React from 'react'
import './Header.css';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
const Header = () => {
  return (
    <div className='main'>
        <div className='caption'>
        <h1>Talk</h1>
        </div>

        <div className='top-buttons'>
       
        
        <SettingsOutlinedIcon />
        
        </div>


    </div>
  )
}

export default Header