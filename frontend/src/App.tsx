
import React, { useState, useCallback } from 'react';
import './App.css'


const APP_STATUS = {
  IDLE: 'idle', 
  ERROR: 'error', 
  UPLOADING: 'uploading',
  READY_UPLOAD: 'ready_upload',
  READY_USAGE: 'ready_usage', 
} as const


type appStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {
  const initialStatus = APP_STATUS.IDLE
  const [appStatus, setAppStatus] = useState<appStatusType>(initialStatus);
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const [file] = files ?? [];

    if (!file) {
      console.log('No file selected');
      setAppStatus(APP_STATUS.ERROR);
      return;
    }
    
    console.log(file);
    setFile(file);
    setAppStatus(APP_STATUS.READY_UPLOAD);
  }, []);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    
      if (!file) {
        console.log('No file selected')
        return
      }
    
      const formData = new FormData()
      formData.append('file', file)
    
      try {
        const response = await fetch('http://localhost:3000/api/files', {
          method: 'POST',
          body: formData
        })
    
        if (!response.ok) {
          throw new Error('Failed to upload file')
        }
    
        const data = await response.json()
        console.log('File uploaded successfully', data)
      } catch (error) {
        console.error('Error uploading file', error)
      }
    }



  return (
    <>
<div>
  <h3>Fullstack Test ShawAndPartners</h3>
  <form onSubmit={handleSubmit}>
    <label>Choose a CSV file:</label>
    <input
      onChange={handleInputChange}
      type="file"
      name="file"
      accept=".csv"
      required
    />
    <button type="submit">
      Upload
      
    </button>
  </form>

</div>

    </>
  )
}

export default App
