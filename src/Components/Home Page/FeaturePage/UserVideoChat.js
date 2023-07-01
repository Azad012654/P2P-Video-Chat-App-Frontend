import React, { useRef, useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import './UserVideoChat.css'

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

  
  const webSocketConnection = useRef(new WebSocket('wss://talkapp.onrender.com/videochat'));
  useEffect(() => {
    
    webSocketConnection.current.onopen = () => {
      console.log('WebSocket connection established');
      // sendOrAcceptInvitation(false, offerSignal)
    };
    webSocketConnection.current.onmessage = (message) => {
      const payload = JSON.parse(message.data);
      if (payload?.type === 'offer') {
        setOfferSignal(payload);
        setConnectionStatus(ConnectionStatus.RECEIVING);
      } else if (payload?.type === 'answer') {
        simplePeer?.signal(payload);
      }
    };
  }, [simplePeer]);
console.log(connectionStatus);
  const sendOrAcceptInvitation = (isInitiator, offer) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
          video.play();
        });
        setSimplePeer(sp);
      }).catch((error)=>{
          console.log("Permission Denied"+error)
      })
     
  };
  
  return (
  
    <>
    <div className='web-rtc-video'>
      <div className='main-container'>
          <div className='video-feed2'>
            <video className='videoCaller'  ref={videoCaller}></video>
            </div>
            <div className='video-feed1'>
            <video className='videoSelf'  ref={videoSelf}></video>
            </div>
            
          
      </div>
      {connectionStatus === ConnectionStatus.RECEIVING && (
        <button className='button1' onClick={() => sendOrAcceptInvitation(false, offerSignal)}>
           Annswer
    </button>)}
    {connectionStatus === null ?  (
    <button className='button1' onClick={() => sendOrAcceptInvitation(true)}>Start</button>
    ) :( connectionStatus === ConnectionStatus.OFFERING && 
      <div className="loader">Please wait for someone to join.....</div>
      ) } 

     

      </div>
      


    </>
  );
};

export default UserVideoChat;
