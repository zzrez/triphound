//! Modelled on TourCategoriesNav.js

import React, { useState } from 'react'
import { Link } from 'gatsby'

import Image from './Image'
import './TourCard.css' //was PostCard.css
import './TourSection.css' //was PostSection.css

const TourSectionNew = ({ posts }) => {
    let startLimit = 12,
    showLoadMore = true,
    loadMoreTitle = 'Show More',
    perPageLimit = 12    

    const [limit, increaseLimit] = useState(startLimit);

    let visiblePosts = posts.slice(0, limit || posts.length)
    
    return (
    
        <div className="PostSection">
            
            <div class="PostSection--Grid">                                    
                {visiblePosts.map(tour => (                           
                    <Link key={tour.node.id} to={tour.node.fields.slug} className={`PostCard`}>
                    
                        {tour.node.frontmatter.featuredImage && (
                        <div className="PostCard--Image relative">
                            <Image background src={tour.node.frontmatter.featuredImage} alt={tour.node.frontmatter.title} />
                        </div>)}
                        <div className="PostCard--Content">
                            {tour.node.frontmatter.title && <h3 className="PostCard--Title">{tour.node.frontmatter.title}</h3>}

                            {tour.node.frontmatter.tags && <div className="PostCard--Category">
                            {tour.node.frontmatter.tags.map(cat => cat).join(', ')}</div>}

                            {tour.node.frontmatter.price_from && <div className="PostCard--Category">From ${tour.node.frontmatter.price_from}</div>}

                            <div className="PostCard--Category">ID: {tour.node.frontmatter.tourId}</div>
                            
                            {tour.node.excerpt && <div className="PostCard--Excerpt">{tour.node.excerpt}</div>}
                        </div>           
                    </Link>

                ))}
            </div>

                    {showLoadMore && visiblePosts.length < posts.length && (
                    <div className="taCenter">
                        <button className="button" onClick={() => increaseLimit(limit + perPageLimit)}>
                        {loadMoreTitle}
                        </button>
                    </div>
                    )}
            </div>
    )
}

export default TourSectionNew
