import React from 'react'
import './UtilNavbar.css'
import VoiceChatOutlinedIcon from '@mui/icons-material/VoiceChatOutlined';
import PermPhoneMsgOutlinedIcon from '@mui/icons-material/PermPhoneMsgOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';

const UtilNavbar = () => {
  return (
    <div className='container'>
        <div className='btn'><VoiceChatOutlinedIcon className='actionbtn' /></div>
        <div className='btn'><PermPhoneMsgOutlinedIcon className='actionbtn' /></div>
        <div className='btn'><TextsmsOutlinedIcon className='actionbtn'  /></div>
        <div className='btn'><ChatBubbleOutlinedIcon className='actionbtn' /></div>
        
    </div>
  )
}

export default UtilNavbar