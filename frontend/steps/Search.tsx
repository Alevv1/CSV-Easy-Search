import React, { useState, useEffect } from 'react';
import { searchData } from '../services/search'; // Asegúrate de importar tu función searchData

interface DataItem {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

interface SearchProps {
  initialData: DataItem[];
}

export const Search: React.FC<SearchProps> = ({ initialData }) => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [search, setSearch] = useState<string>('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (search !== '') {
      searchData(search)
        .then(response => {
          const [err, newData] = response;
          if (err) {
            console.error(err);
            return;
          }

          if (newData) setData(newData);
        });
    } else {
      setData(initialData);
    }
  }, [search, initialData]);

  return (
    <div>
      <h1>Search</h1>
      <form>
        <input onChange={handleSearch} type="search" placeholder="Search information..." />
      </form>
      {data.map((item: DataItem, index: number) => (
        <div key={index}>
          <p>{item.name}</p>
          <p>{item.city}</p>
          <p>{item.country}</p>
          <p>{item.favorite_sport}</p>
        </div>
      ))}
    </div>
  );
};