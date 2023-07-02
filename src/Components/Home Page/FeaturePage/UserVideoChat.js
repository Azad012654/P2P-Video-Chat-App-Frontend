import React, { useRef, useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import './UserVideoChat.css'
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

const ConnectionStatus = {
  OFFERING: 'OFFERING',
  RECEIVING: 'RECEIVING',
  CONNECTED: 'CONNECTED',
};

const UserVideoChat = () => {
  const videoSelf = useRef(null);
  const videoCaller = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [offerSignal, setOfferSignal] = useState(null);
  const [simplePeer, setSimplePeer] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');


  const toggleCameraFacingMode = () => {
    const newFacingMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(newFacingMode);
  
    // Apply the camera facing mode constraint to the media stream
    const videoTrack = mediaStream.getVideoTracks()[0];
    videoTrack.applyConstraints({ facingMode: newFacingMode })
      .then(() => {
        console.log(`Camera facing mode set to ${newFacingMode}`);
      })
      .catch((error) => {
        console.log('Error setting camera facing mode:', error);
      });
  };


  // const webSocketConnection = useRef(new WebSocket('wss://talkapp.onrender.com/videochat'));
  const webSocketConnection = useRef(new WebSocket('ws://localhost:8080/videochat'));
  useEffect(()=>{
    if(connectionStatus==null){
      console.log("Hello");
    }
  })
  useEffect(() => {
    
    webSocketConnection.current.onopen = () => {
      console.log('WebSocket connection established');
      // sendOrAcceptInvitation(false, offerSignal)
    };
    webSocketConnection.current.onmessage = (message) => {
      try{
      const payload = JSON.parse(message.data);
      if (payload?.type === 'offer') {
        setOfferSignal(payload);
        setConnectionStatus(ConnectionStatus.RECEIVING);
      } else if (payload?.type === 'answer') {
        simplePeer?.signal(payload);
      }
      } catch(error){ console.log("Somethig Went Wrong"+error)};
    };
  }, [simplePeer]);
console.log(connectionStatus);

  const sendOrAcceptInvitation = (isInitiator, offer) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true } )
      .then((mediaStream) => {
        const video = videoSelf.current;
        video.srcObject = mediaStream;
        video.play();

        const sp = new SimplePeer({
          trickle: false,
          initiator: isInitiator,
          stream: mediaStream,
        });
       
        if (isInitiator) setConnectionStatus(ConnectionStatus.OFFERING);
        else if (offer) sp.signal(offer);

        sp.on('signal', (data) => webSocketConnection.current.send(JSON.stringify(data)));
        
        sp.on('connect', () => setConnectionStatus(ConnectionStatus.CONNECTED));
        sp.on('stream', (stream) => {
          const video = videoCaller.current;
          video.srcObject = stream;
          console.log(stream);
          if(!stream.active){
            console.log("Shu up")
          }
          video.play();
        });
        setSimplePeer(sp);
      }).catch((error)=>{
          console.log("Permission Denied"+error)
          alert("Video and Microphone Permission require to make calls");
      })
     
  };
  
  return (
  
    <>
    {/* <div className='web-rtc-video'>
      <div className='main-container'>
          <div className='video-feed2'>
            <video className='videoCaller'  ref={videoCaller}></video>
            </div>
            <div className='video-feed1'>
            <video className='videoSelf'  ref={videoSelf}></video>
            </div>
      </div> */}


      <div className='web-rtc-video'>
      <div className='main-container'>
          
            <video className='video-feed2'  ref={videoCaller}>
            </video>
            <video className='video-feed1'  ref={videoSelf}></video>
            <div >
            </div>
      </div>

      {connectionStatus === ConnectionStatus.RECEIVING && (
        <button className='button2' onClick={() => sendOrAcceptInvitation(false, offerSignal)}>
           <PhoneEnabledRoundedIcon></PhoneEnabledRoundedIcon>
    </button>)}
    {connectionStatus === null ?  (
    <button className='button1' onClick={() => sendOrAcceptInvitation(true)}><PhoneEnabledRoundedIcon /></button>
    ) :( connectionStatus === ConnectionStatus.OFFERING && 
      <div className="loader">PLEASE WAIT FOR SOMEONE TO JOIN..... <RefreshOutlinedIcon className='loading_icon' /></div>
      ) } 
      {connectionStatus === ConnectionStatus.CONNECTED && (
        <button className='button3' onClick={() => window.location.reload()}>
           <PhoneEnabledRoundedIcon></PhoneEnabledRoundedIcon>
    </button>)}
      </div>
    </>
  );
};

export default UserVideoChat;
