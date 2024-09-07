import React from "react";
import 'assets/css/components';
import * as images from 'assets/images';

export default function SearchBar ({searchQuery, setSearchQuery, handleSearch}){

    return(
        <>
            <div className="SearchBar__container">
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button className="SearchBar__button" onClick={handleSearch}>
                    <img src={images.searchIcon} alt="Search Icon" />
                </button>
            </div>
        </>
    );
};