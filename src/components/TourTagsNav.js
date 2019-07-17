import React from 'react'
import { Link } from 'gatsby'

import BlogSearch from './BlogSearch'
import './TourCategoriesNav.css' //version of PostCategoriesNav.css

const TourTagsNav = ({ tags, place, enableSearch }) => {

  let adjPlace, adjPlaceText
  if (place) {
    adjPlace = place.toLowerCase()
    adjPlaceText = "All "+ place
  } else {
    adjPlace = "all"
    adjPlaceText = "All"
  }

  return (
        
  <div className="PostCategoriesNav">
    <Link className="NavLink" exact="true" to={`${adjPlace}`}>
      {adjPlaceText}
    </Link>
    {tags.map((tag, index) => (
      <Link
        exact="true"
        className="NavLink"
        key={tag + index}
        to={adjPlace + "/" + tag.toLowerCase()}
      >
        {tag}
      </Link>
    ))}
    
    {enableSearch && <BlogSearch />}
  </div>
  )
}

export default TourTagsNav
