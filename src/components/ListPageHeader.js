//! Modelled on PageHeader.js but simpler
import React from 'react'
import PropTypes from 'prop-types'

import Image from './Image'
import Content from './Content'
import './ListPageHeader.css' //version of PageHeader.css
import DropMenuButton from "./DropMenuButton";

const ListPageHeader = ({ place, tag, count }) => {
  //let backgroundImage = ""

  //let className = "PageHeader relative"
  //className = ""

  //*Format?
  // 13 Adventure activities in Jaco / Costa Rica
  // 50 total activities in Jaco
  // or
  // Adventure activities in Jaco / Costa Rica  (13)
  // All activities in Jaco (50)


  let tagTitle
  if (tag) {
      tagTitle = tag
  } else {
      tagTitle = "All"
  }
  tagTitle = tagTitle + " activities in "

  let placeTitle
  if (place) {
    placeTitle = tagTitle + place
  } else {
      placeTitle = tagTitle + "Costa Rica"
  }

  placeTitle = placeTitle  + " ("+count+")"

  return (
      <div className="container">
        <h2>{placeTitle}</h2>
        <DropMenuButton title="Filters" id="dropButton"/>
      </div>
  )
}

ListPageHeader.propTypes = {
  place: PropTypes.string,
  tag: PropTypes.string
}

export default ListPageHeader
