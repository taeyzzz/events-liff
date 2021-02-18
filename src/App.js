import React, { useState, useEffect } from 'react'
import liff from '@line/liff';

import "./global-style.scss"

function App() {
  const [userData, setUserData] = useState(undefined)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      setStatus("init")
      await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
      if (!liff.isLoggedIn()) {
        setStatus("start login")
        liff.login({ redirectUri: process.env.REACT_APP_REDIRECT_URI });
      }
      setStatus('get profile');
      const profileData = await liff.getProfile()
      setStatus('get accessToken');
      const accessToken = liff.getAccessToken();
      setUserData(profileData)
    } catch (e) {
      console.log(e);
      setStatus("init failure")
    }

  }

  const handleMessageChanged = (e) => {
    setMessage(e.target.value)
  }

  const handleLeaveClicked = async () => {
    await liff.sendMessages([
      {
        "type": "text",
        "text": message
      }
    ])
    liff.closeWindow();
  }

  return (
    <div className="application-container">
      Hello
      <div>
        status: {status}
      </div>
      <div>
        Welcome to LIFF
      </div>
      <div>
        UserId: {userData?.userId}
      </div>
      <div>
        Display Name: {userData?.displayName}
      </div>
      <div className="profile-image-container">
        <img src={userData?.pictureUrl} />
      </div>
      <div>
        Status: {userData?.statusMessage}
      </div>
      <input type="text" value={message} onChange={handleMessageChanged}/>
      <button onClick={handleLeaveClicked}>Good bye</button>
    </div>
  );
}

export default App;
