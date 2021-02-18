import React, { useState, useEffect } from 'react'

import "./global-style.scss"

const liff = window.liff;

function App() {
  const [userData, setUserData] = useState(undefined)
  const [message, setMessage] = useState("")
  const [isInLiff, setIsInLiff] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: process.env.REACT_APP_REDIRECT_URI });
    }
    const profileData = await liff.getProfile()
    const accessToken = liff.getAccessToken();
    setUserData(profileData)
    const isInLiffBrowser = liff.isInClient()
    setIsInLiff(isInLiffBrowser)
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
