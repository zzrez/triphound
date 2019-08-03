//* based on TourRegionsNav.js, https://flaviocopes.com/css-grid/ 

import React from 'react'
import { Link } from 'gatsby'

import TourSearch from './TourSearch' //version of BlogSearch
import './SideBar.css' //https://www.w3schools.com/howto/howto_css_sidebar_responsive.asp

const Sidebar = ({ regions, tags, tag, place, enableSearch }) => {

  let adjPlace, adjPlaceText, selTag
  if (place) {
    adjPlace = place.toLowerCase()
    adjPlaceText = "All "+ place
  } else {
    adjPlace = "all"
    adjPlaceText = "All"
  }
  selTag = tag

  return (
  
  <div className="aside">
    
    <div className="sidebar">
      {enableSearch && <TourSearch />}

      <div className="subtitle">REGION</div>
      <Link exact="true" to={`/all/`}>
        All
      </Link>
      
      {regions.map((region, index) => {
        if (place===region) {
          return (
          <Link className="active" 
            exact="true"
            key={region + index}
            to={region.toLowerCase()} >
            {region}
          </Link>
          )
        } else {
          return (
          <Link
            exact="true"
            key={region + index}
            to={region.toLowerCase()} >
            {region}
          </Link>
          )
        }
        
      })}

      <div className="subtitle">CATEGORY</div>

      {tags.map((tag, index) => {
        if (tag===selTag) {
          return (
          <Link className="active" 
            exact="true"
            key={tag + index}
            to={adjPlace + "/" + tag.toLowerCase()}
            >
            {tag}
          </Link>
          )
        } else {
          return (
          <Link
            exact="true"
            key={tag + index}
            to={adjPlace + "/" + tag.toLowerCase()}
            >
            {tag}
          </Link>
          )
        }
      })}
    </div>
  </div>
  )
}

export default Sidebar
