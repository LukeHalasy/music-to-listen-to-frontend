import React from 'react'
import CONFIG from '../config/index.js'
import {
  Box,
  Flex,
  Image,
  Text
} from 'rebass'
import Axios from 'axios';

const Cards = (props) => {
  const onClick = async (e) => {
    let text = e.currentTarget.innerText;
    let artist = text.substring(0, text.indexOf("-") - 1);
    let title = text.substring(text.indexOf("-") + 2, text.length);

    // delete the album from the data
    const res = await Axios.delete(`${CONFIG.SERVER_URL}/albums/${title}`);

    props.removeAlbum(title, artist);
  }

  let cards = props.albums.map(c => {
    return (
      <Box sx={{
        'border': '1px solid black',
        'background': props.colors.cardBg,
        ':hover': {
          backgroundColor: props.colors.cardHover,
          cursor: 'pointer'
        }
      }} px={20} py={2} width={1/6} key={c.title} onClick={onClick}>
        <Image src={c.image} />
        <Text p={1} color='black' bg='primary'>{c.artist + " - " + c.title}</Text>
      </Box>
    )
  });

  return (
      <Flex flexWrap='wrap' mx={-2}>
        {cards}
      </Flex>
  )
}

export default Cards
