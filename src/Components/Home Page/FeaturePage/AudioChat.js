import React, { useRef, useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import './UserVideoChat.css'

const ConnectionStatus = {
  OFFERING: 'OFFERING',
  RECEIVING: 'RECEIVING',
  CONNECTED: 'CONNECTED',
};

const AudioChat = () => {
  const videoSelf = useRef(null);
  const videoCaller = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [offerSignal, setOfferSignal] = useState(null);
  const [simplePeer, setSimplePeer] = useState(null);

  const webSocketConnection = useRef(new WebSocket('wss://talkapp.onrender.com/videochat'));

  useEffect(() => {
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
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
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
      });
  };

  return (
    <div className="web-rtc-page">
      {connectionStatus === null && (
        <button className='button1' onClick={() => sendOrAcceptInvitation(true)}>CALL</button>
      )}
      {connectionStatus === ConnectionStatus.OFFERING && (
        <div className="loader"></div>
      )}
      {connectionStatus === ConnectionStatus.RECEIVING && (
        <button onClick={() => sendOrAcceptInvitation(false, offerSignal)}>
          ANSWER CALL
        </button>
      )}
      <div className="video-container" style={{height:'500px', width:'500'}}>
        <video style={{height:'450px', width:'300px',borderRadius:'10px' }} ref={videoSelf} className="video-block" />
        <video style={{height:'150px', width:'200px',position: 'absolute', bottom: '10px', right: '10px'}} ref={videoCaller} className="video-block" />
      </div>
    </div>
  );
};

export default AudioChat;
