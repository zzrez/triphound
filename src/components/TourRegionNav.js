//version of PostCategoriesNav
import React from 'react'
import { Link } from 'gatsby'

import BlogSearch from './BlogSearch'
import './TourCategoriesNav.css' //version of PostCategoriesNav.css

const TourRegionNav = ({ places, enableSearch }) => (
  <div className="PostCategoriesNav">
    <Link className="NavLink" exact="true" to={`/tours/`}>
      All Places
    </Link>
    {places.map((place, index) => (
      <Link
        exact="true"
        className="NavLink"
        key={place.title + index}
        to={place.slug}
      >
        {place.title}
      </Link>
    ))}

    {enableSearch && <BlogSearch />}
  </div>
)

export default TourRegionNav
