import React, { useState } from 'react'
import Head from 'next/head'
import Cards from '../components/cards'
import axios from 'axios'
import Search from '../components/search'
import CONFIG from '../config/index.js'
import Link from 'next/link'

const colors = {
  bg: '#cca8e9',
  cardBg: '#c3bef0',
  cardHover: '#cadefc',
  search: '#defcf9',
  searchBorder: '#694489',
  searchBorderFocus: '#4c3163'
}

const Listened = (props) => {
  const [albums, setAlbums] = useState(props.albums);
  const [isLoading, setIsLoading] = useState(true);

  const insertAlbumIntoDatabase = async (album) => {
    const res = await axios.post(`${CONFIG.SERVER_URL}/albums`, {
      title: album.name,
      artist: album.artist,
      image: album.image[2]['#text']
    });
  }
  const insertAlbum = (album) => {
    setAlbums([...albums, { title: album.name, artist: album.artist, image: album.image[2]['#text']}]);

    insertAlbumIntoDatabase(album);
  }

  const removeAlbum = (album_name, artist) => {
    let new_albums_list = [...albums];
    let index;
    for (let i = 0; i < new_albums_list.length; i++) {
      if (album_name === new_albums_list[i].title && artist === new_albums_list[i].artist) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      new_albums_list.splice(index, 1);
      setAlbums(new_albums_list);
    }
  }

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />

      <Head>
        <title>Music To Listen To</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page">
        <Link href="/">
          <a>To Listen To</a>
        </Link>
        <Search insertAlbum={insertAlbum} colors={colors} />
        <Cards albums={albums} removeAlbum={removeAlbum} colors={colors} />
      </div>

      <style jsx>{`
        .page {
          background-color: ${colors.bg};
        }

        Cards {
          position: relative;
          margin: auto;
          border: 5px solid black;
        }
      `}</style>
    </div>
  )
}

Listened.getInitialProps = async function({ req }) {
  const res = await axios.get(`${CONFIG.SERVER_URL}/albums`)

  return ({
    albums: res.data
  })
};


export default Listened