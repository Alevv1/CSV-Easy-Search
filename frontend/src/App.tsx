
import { useState } from 'react'
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


  const {appStatus, setAppStatus} = useState(APP_STATUS.IDLE)
  const [file, setFile] = useState<File | null>(null)


  const handleInputChange = (event: React.
    ChangeEvent<HTMLInputElement>)=>{
      const[file] = event.target.files ?? []


      if (file) {
        console.log(file) 
        setFile(file)
        setAppStatus(APP_STATUS.READY_UPLOAD)
      }
    }
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault()
      console.log('TODO')
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
