import React, { useState } from 'react';
import CONFIG from '../config/index.js';

const Search = (props) => {
  const [activeOption, setActiveOption] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [userInput, setUserInput] = useState('');

  const onChange = (e) => {
    setUserInput(e.target.value);
    setActiveOption(0);
  }

  const onClick = (e) => {
    setActiveOption(0);
    setFilteredOptions([]);
    setShowOptions(false);
    setUserInput("");

    let text = e.target.innerText

    const album = filteredOptions.find(element => {
      return (element.artist == text.substring(0, text.indexOf("-") - 1) && element.name == text.substring(text.indexOf("-") + 2, text.length));
    });

    props.insertAlbum(album);
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (filteredOptions.length !== 0) {
        setUserInput("");
        setFilteredOptions([]);
        setShowOptions(false);
        setActiveOption(false);

        const album = filteredOptions[activeOption]
        props.insertAlbum(album);
      }
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return
      }

      setActiveOption(activeOption - 1);
    } else if (e.keyCode === 40) {
      if (activeOption + 1 === filteredOptions.length) {
        return;
      }

      setActiveOption(activeOption + 1);
    } else if (e.keyCode === 8) {
      setFilteredOptions([]);
      setShowOptions(false);
      setActiveOption(0)
    }
  }

  const onSearch = async (e) => {
    const res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${userInput}&api_key=${CONFIG.LASTFM_API_KEY}&format=json`);
    const json = await res.json();

    if (json && json.results.albummatches.album.length !== 0) {
      setActiveOption(0);
      setFilteredOptions(json.results.albummatches.album.slice(0, 5));
      setShowOptions(true);
    }
  }

  let optionList;
  if (showOptions && userInput) {
    if (filteredOptions.length) {
      optionList = (
        <React.Fragment>
          <ul className="options">
            {
              filteredOptions.map((album, index) => {
                let className;
                if (index === activeOption) {
                  className = "option-active";
                }

                return (
                  <li className={className} key={album.url} onClick={onClick}>
                    {album.artist + " - " + album.name}
                  </li>
                );
              }) 
            }
          </ul>
          <style jsx>{`
            ul.options {
              display: block;
              list-style: none;
              width: 30rem;
              transition: width 0.3s;
              margin: auto;
              position: relative;
            }
            
            ul.options li {
              display: block;
              background: white;
              margin: 10px auto;
              padding: 10px;
              font-size: 1.2rem;
              width: 100%;
              border-radius: 2px;
            }
            ul.options li:hover {
              font-weight: bold;
              color: #00b4cc;
              cursor: pointer;
              transition: 0.3s all;
            }
            
            ul.options li.option-active {
              background: whitesmoke;
              font-size: 1.5rem;
              color: #00b4cc;
            }
          `}</style>
        </React.Fragment>
      )
    } else {
      optionList = (
        <p>No Options!</p>
      )
    }
  }

  return (
    <React.Fragment>
      <div className="search">
        <input
          type="text" 
          className="search-box" 
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        <input type="submit" value="" className="search-btn" onClick={onSearch} />
        {optionList}
      </div>

      <style jsx>{`
      .search {
        width: 33rem;
        margin: 0rem auto 2rem auto;
        padding: 2rem 0rem 0rem 0rem;
        text-align: right;
        position: relative;
      }
      .search-box {
        background-color: ${props.colors.search};
        border: 4px solid ${props.colors.searchBorder};
        border-radius: 2px;
        font-size: 2rem;
        width: 100%;
        padding: 1rem;
        transition: width 0.3s;
      }
      .search-box:focus {
        width: 100%;
        outline: none;
        border: 4px solid ${props.colors.searchBorderFocus};
      }

      .search-btn {
        height: 100%;
        width: 4em;
        margin-top: -1em;
        position: absolute;
        top: 50%;
        right: 0.5rem;
      
        opacity: 0.2;
        background-color: transparent;
        border: 0;
        background-repeat: no-repeat;
        background-size: 100%;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAACnElEQVR4AcXZsUsbYRjH8e+dh2s1SyAGJwMJuDj1BIcEhJQIOnTq5F+QOf0jIq79A7oFh7aYyVBEkaZDC3awECc1AUXRIqUQotfFocnjJe/dk+b9PKP65Md7z13ee3Uwk2SNHKmngs5TnbDLJQqjA+RYZ4OXuDzvkSYf+cAJ44fPAYFhHeAzVhlqBBGrRoax8KjSJYhRXap4KCVoECiqQQKFLC0CZbXIElOBOwJ9cUchzm2Y5QsveN4tdfY4o00HSDHHPKuUmOV5v/D5SSSJ0MXfIY+HBB55dkIvRIIIvJDR28dnFJ/9kHH0MFaVDehRxlSZnuxAFUMZunKQKBJFUQ4wXTIYqcmPZ5GoFmUEahjw5eJTJI6ivBD4jCS/csrEVZZfU4yQk5OPhrwjcoRygQ0GVdCQf73OUEfisaMkHk1HDJHkYeDX82jlBzo+kCSEyxruwDP/EK1DbsWnhHDFgNTpodWjLgY9NECKfnvoyS4p8wBngN5Z/ABtQK8dP0AH0OuYB5iMqfAAMque7HJtHmAOPdnlxjzAPHqyy5V5gFX0ZJfj8AAn9CvhoeVRol8zPMAuj/xrlhW0Vpg1D3ApflhGR3b4wTlDvI24i4u+w9y0uyVrM213U1qxuy2/Z8bui8m23VezgGW7L6cBLdIWXs9FBAsHFCLCJI9opFMKXEzkkEp/IbK0bEdI0LARQRzVWoigPKy+Z5tlWooIiuP6NhVmAEiPNwLkqHDEw5CGx2wyDQDRI8T7l80U19xwxTFNmpwzKM1nFsyeCw7jFymCAxYjrHDp8r9cUOCUYRZ4Bw6AxVV47QJYXIVXLliNsOSC1Qh/XLAa4ZuDmmIcH1l2AaytwhZfmaAkn/qOb7eYBofJekOJJX7znfccAvwFyB3OeNys7d4AAAAASUVORK5CYII=");
      }
      .search-btn:hover {
        outline: none;
        opacity: 0.4;
        cursor: pointer;
      }
      .search-btn:focus {
        outline: none;
        opacity: 0.6;
      }
    `}</style>
    </React.Fragment>
  )
}

export default Search