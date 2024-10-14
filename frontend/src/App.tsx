import React, { useState, useCallback } from 'react';
import './App.css';
import { Search } from '../steps/Search';

interface DataItem {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  UPLOADING: 'uploading',
  READY_UPLOAD: 'ready_upload',
  READY_USAGE: 'ready_usage',
} as const;

type appStatusType = typeof APP_STATUS[keyof typeof APP_STATUS];

function App() {
  const [data, setData] = useState<DataItem[]>([]);
  const initialStatus = APP_STATUS.IDLE;
  const [appStatus, setAppStatus] = useState<appStatusType>(initialStatus);
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.log('No file selected');
      setAppStatus(APP_STATUS.ERROR);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setAppStatus(APP_STATUS.UPLOADING);
      const response = await fetch('http://localhost:3000/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const responseData = await response.json();
      setData(responseData.data);
      console.log('File uploaded successfully', responseData);
      setAppStatus(APP_STATUS.READY_USAGE);
    } catch (error) {
      console.error('Error uploading file', error);
      setAppStatus(APP_STATUS.ERROR);
    }
  };

  const handleDemoUpload = async () => {
    const demoFileUrl = '/demo.csv'; 

    try {
      const response = await fetch(demoFileUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', new File([blob], 'demo.csv', { type: 'text/csv' }));

      setAppStatus(APP_STATUS.UPLOADING);

      const uploadResponse = await fetch('http://localhost:3000/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload demo file');
      }

      const responseData = await uploadResponse.json();
      setData(responseData.data);
      console.log('Demo file uploaded successfully', responseData);
      setAppStatus(APP_STATUS.READY_USAGE);
    } catch (error) {
      console.error('Error uploading demo file', error);
      setAppStatus(APP_STATUS.ERROR);
    }
  };

  return (
    <>
      <div className="upload-section">
        <h3 className="title">CSV Easy Search</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <label htmlFor="file" className="label">
            Upload your CSV file:
          </label>
          <input
            onChange={handleInputChange}
            type="file"
            name="file"
            id="file"
            accept=".csv"
            required
            className="file-input"
          />
          <button type="submit" className="upload-button" disabled={appStatus === APP_STATUS.UPLOADING}>
            {appStatus === APP_STATUS.UPLOADING ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <button onClick={handleDemoUpload} className="upload-button demo-button" disabled={appStatus === APP_STATUS.UPLOADING}>
          Load Demo CSV
        </button>

        <Search initialData={data} />
      </div>
    </>
  );
}

export default App;
