import React, {useEffect, useState} from "react";
import axios from 'axios';
import '../styles/SearchableDropdown.css';

const SearchableDropdown = ({
    items,
    onSelect,
    placeholder,
    isLoading,
    allowCreate = false,
    searchTerm,
    setSearchTerm
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showCreateOption = allowCreate &&
    searchTerm.length > 0 &&
    !items.some(item => item.name.toLowerCase() === searchTerm.toLowerCase());

    return (
      <div className="dropdown-container">
          <div className="searchable-dropdown">
              <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                  <input
                      type="text"
                      placeholder={placeholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={() => setIsOpen(true)}
                  />
                  <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
              </div>
  
              {isOpen && (
                  <div className="dropdown-list">
                      <div className="scroll-container">
                          {isLoading ? (
                              <div className="dropdown-item">Loading...</div>
                          ) : (
                              <>
                                  {filteredItems.map((item) => (
                                      <div
                                          key={item.id}
                                          className="dropdown-item"
                                          onClick={() => {
                                              onSelect(item);
                                              setIsOpen(false);
                                          }}
                                      >
                                          {item.name}
                                      </div>
                                  ))}
                                  {showCreateOption && (
                                      <div
                                          className="dropdown-item create-new"
                                          onClick={() => {
                                              onSelect({ name: searchTerm });
                                              setIsOpen(false);
                                          }}
                                      >
                                          + Create "{searchTerm}"
                                      </div>
                                  )}
                              </>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};  

export default SearchableDropdown;