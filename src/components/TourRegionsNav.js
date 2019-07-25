import React from 'react'
import { Link } from 'gatsby'

import TourSearch from './TourSearch' //version of BlogSearch
import './TourCategoriesNav.css' //version of PostCategoriesNav.css

const TourRegionsNav = ({ regions, place, enableSearch }) => {

  return (
        
  <div className="PostCategoriesNav">
    <Link className="NavLink" exact="true" to={`/all/`}>
      All
    </Link>
    {regions.map((region, index) => (
      <Link
        exact="true"
        className="NavLink"
        key={region + index}
        to={region.toLowerCase()}
      >
        {region}
      </Link>
    ))}
    
    {enableSearch && <TourSearch />}
  </div>
  )
}

export default TourRegionsNav
