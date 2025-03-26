import { useState } from 'react'
import { ShotUpload } from 'shotupload-sdk'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <h1>ShotUpload SDK Test</h1>
      <div className="component-container">
        <ShotUpload />
      </div>
    </div>
  )
}

export default App
