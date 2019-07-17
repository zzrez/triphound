//! Modelled on PageHeader.js but simpler
import React from 'react'
import PropTypes from 'prop-types'

import Image from './Image'
import Content from './Content'
import './ListPageHeader.css' //version of PageHeader.css

const ListPageHeader = ({ place, tag, count }) => {
  let backgroundImage = ""
  
  let className = "PageHeader relative"
  className = ""

  let placeTitle
  if (place){
    placeTitle = place
} else {
    placeTitle = "All tours"
}
  
  let tagTitle
  if (tag) {
      tagTitle = tag + " ("+count+")"
  } else {
      tagTitle = "("+count+")"
  }
  
  return (
    <div className={className}>
      {backgroundImage && (
        <Image
          background
          resolutions="large"
          src={backgroundImage}
          alt={place}
          size="cover"
        />
      )}
      <div className="container relative">
        <h1 className="PageHeader--Title">{placeTitle}</h1>
        {tagTitle && (
          <Content className="PageHeader--Subtitle" src={tagTitle} />
        )}
      </div>
    </div>
  )
}

ListPageHeader.propTypes = {
  place: PropTypes.string,
  tag: PropTypes.string
}

export default ListPageHeader
