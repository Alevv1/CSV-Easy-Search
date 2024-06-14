import React, { useState, useEffect } from 'react';
import {searchData} from '../services/search'

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
    if (search === '') {
      setData(initialData);
    } else {
      const filteredData = initialData.filter((item: DataItem) =>
        Object.values(item).some((val: string | number) =>
          val.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      setData(filteredData);
    }
  }, [search, initialData]);

  useEffect(() => {
    searchData(search)
      .then(response => {
        const [err, newData] = response;
        if (err) {
          console.error(err);
          return;
        }
  
        if (newData) {
          const formattedData: DataItem[] = newData.map((item: any) => ({
            name: item.name,
            city: item.city,
            country: item.country,
            favorite_sport: item.favorite_sport
          }));
  
          setData(formattedData);
        }
      })
      .catch(error => console.error(error));
  }, [search, initialData]);





  return (
    <div className="container">
      <h1>Search</h1>
      <form>
        <input 
          onChange={handleSearch} 
          type="search" 
          placeholder="Search information..." 
          className="search-input"
        />
      </form>
      <ul className="grid">
        {data.map((row) => (
          <li key={row.name} className="grid-item">
            <article className="card">
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}: </strong>{value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};