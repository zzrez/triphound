// https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
//! Copy of ToursIndexPage4.js, but changing CSS from MUI

//! This creates region/tag pages, eg http://localhost:8000/osa/adventure/


//* full version for tags
import React, { useState } from 'react';
import { Link, graphql } from 'gatsby';
import qs from 'qs'

//* names of imports kept same as BlogIndex (for moment)
// import PageHeader from '../components/PageHeader'
// import PostSection from '../components/TourSection' //version of PostSection

//import TourRegionNav from '../components/TourRegionNav' //version of PostCategoriesNav
import Layout from '../components/Layout'
import TourTagsNav from '../components/TourTagsNav' //version of PostCategoriesNav
import TourRegionsNav from '../components/TourRegionsNav' //version of TourTagsNav

import Image from '../components/Image'
import '../components/TourCard.css' //was PostCard.css
import '../components/TourSection.css' //was PostSection.css


const PlaceCatIndex = ({ pageContext, data }) => {
  const { tag, place, tagsRegion, allRegions } = pageContext;
  // const { edges, totalCount } = data.allMarkdownRemark;
  // const post = data.markdownRemark
  let { edges: posts, totalCount } = data.allMarkdownRemark;
  //const totalCount = data.allMarkdownRemark.totalCount
  // const posts = data.allMarkdownRemark
  // const totalCount = posts.totalCount
  //const posts = data.allMarkdownRemark.edges.node
  //let { title, tags, price_from, featuredImage } = posts.node.frontmatter;
  //let { title, tags, price_from, featuredImage } = data.allMarkdownRemark.edges.node.frontmatter;


  const arrTagsRegion = tagsRegion.split(",")
  const arrAllRegions = allRegions.split(",")

  let mainTitle
  if (tag) {
      mainTitle = place + "-" + tag
  } else {
      mainTitle = place
  }
  mainTitle = mainTitle + " ("+totalCount+")"

    let startLimit = 2,
    showLoadMore = true,
    loadMoreTitle = 'Show More',
    perPageLimit = 1,
    enableSearch = true

    const [limit, increaseLimit] = useState(startLimit);

    let visiblePosts = posts.slice(0, limit || posts.length)

    //* Add filter
    // let queryObj = body.search.replace('?', '')
    // //let queryObj = search.replace('?', '')
    //   queryObj = qs.parse(queryObj)

    // if (enableSearch && queryObj.s) {
    //   const searchTerm = queryObj.s.toLowerCase()
    //   posts = posts.filter(post =>
    //     post.frontmatter.title.toLowerCase().includes(searchTerm)
    //   )
    // }

  // const tagHeader = `${totalCount} post${
  //   totalCount === 1 ? '' : 's'
  // } tagged with "${tag}"`;
  return (
    <Layout>

      <main className="Blog">
            <h1 style={{textAlign: 'center'}}>{mainTitle}</h1>
            
            {!!arrAllRegions.length && (
                <section className="section thin">
                <div className="container">
                    <TourRegionsNav enableSearch 
                    regions={arrAllRegions}
                    place = {place} />
                </div>
                </section>
            )}

            {!!arrTagsRegion.length && (
                <section className="section thin">
                <div className="container">
                    <TourTagsNav 
                    tags={arrTagsRegion}
                    place = {place} />
                </div>
                </section>
            )}

            {/*START OF TOUR LISTING*/}
            {!!visiblePosts.length && (
              <section className="section">
                <div className="container">
                    <div class="PostSection">
                        <div class="PostSection--Grid">
                            
                            {visiblePosts.map(activity => (                           

                            <Link key={activity.node.id} to={activity.node.fields.slug} className={`PostCard`}>
                            {activity.node.frontmatter.featuredImage && (
                              <div className="PostCard--Image relative">
                                <Image background src={activity.node.frontmatter.featuredImage} alt={activity.node.frontmatter.title} />
                              </div>
                            )}
                            <div className="PostCard--Content">
                              {activity.node.frontmatter.title && <h3 className="PostCard--Title">{activity.node.frontmatter.title}</h3>}

                              {activity.node.frontmatter.tags && <div className="PostCard--Category">
                              {activity.node.frontmatter.tags.map(cat => cat).join(', ')}
                              </div>}

                              {activity.node.frontmatter.price_from && <div className="PostCard--Category">From ${activity.node.frontmatter.price_from}</div>}
                              
                              {activity.node.excerpt && <div className="PostCard--Excerpt">{activity.node.excerpt}</div>}
                            </div>
                            </Link>


                            ))}

                        </div>
                    </div>
                </div>
              </section>
            )}

            {showLoadMore && visiblePosts.length < posts.length && (
            <div className="taCenter">
                <button className="button" onClick={() => increaseLimit(limit + perPageLimit)}>
                {loadMoreTitle}
                </button>
            </div>
            )}

      </main>

    </Layout>
  );
}

export default PlaceCatIndex;

export const pageQuery = graphql`
  query($tag: String, $place: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {frontmatter: {tags: { in: [$tag] } meeting: { eq: $place } }}
    ) {
        totalCount
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              title
              date
              tags
              price_from
              featuredImage
              meeting
            }
          }
        }
      }
  }
`;