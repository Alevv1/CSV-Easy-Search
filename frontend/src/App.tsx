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

    try {
      setAppStatus(APP_STATUS.UPLOADING);
      const text = await file.text();
      const parsedData = parseCsvToJson(text);
      setData(parsedData);
      setAppStatus(APP_STATUS.READY_USAGE);
      console.log('File uploaded successfully', parsedData);
    } catch (error) {
      console.error('Error uploading file', error);
      setAppStatus(APP_STATUS.ERROR);
    }
  };

  const handleDemoUpload = async () => {
    const demoFileUrl = '/demo.csv'; // Acceso directo a la carpeta public
  
    try {
      setAppStatus(APP_STATUS.UPLOADING);
      const response = await fetch(demoFileUrl);
  
      if (!response.ok) {
        throw new Error('Failed to load demo file');
      }
  
      const text = await response.text();
      const parsedData = parseCsvToJson(text);
      if (parsedData.length === 0) {
        throw new Error('No valid data found in demo CSV');
      }
      setData(parsedData);
      setAppStatus(APP_STATUS.READY_USAGE);
      console.log('Demo file loaded successfully:', parsedData);
    } catch (error) {
      console.error('Error loading demo file:', error);
      setAppStatus(APP_STATUS.ERROR);
    }
  };

  const parseCsvToJson = (csvText: string): DataItem[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
  
    const result: DataItem[] = lines.slice(1)
      .map((line) => {
        const values = line.split(',');
        const item: Partial<DataItem> = {}; // Usamos Partial para inicializar como una posible parte de DataItem
  
        headers.forEach((header, index) => {
          item[header.trim() as keyof DataItem] = values[index]?.trim() || '';
        });
  
        // Verificar si el objeto cumple con la interfaz DataItem
        if (
          typeof item.name === 'string' &&
          typeof item.city === 'string' &&
          typeof item.country === 'string' &&
          typeof item.favorite_sport === 'string'
        ) {
          return item as DataItem; // En este punto, TypeScript debería aceptar la conversión ya que hemos validado los campos
        }
  
        return null;
      })
      .filter((item): item is DataItem => item !== null); // Filtrar nulos y asegurarse de que el resultado sea de tipo DataItem
  
    return result;
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
