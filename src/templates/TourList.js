// https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
//! DIFFERENCE WITH NORMAL TOURLIST IS QRAPHQL WITH SIMPLER FILTER
//! Copy of ToursIndexPage4.js, but changing CSS from MUI
//! Adds location from @reach/router as TourIndex.js

//! This creates region/tag pages, eg http://localhost:8000/osa/adventure/


//* full version for tags
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Location } from '@reach/router'
import qs from 'qs'


//import TourRegionNav from '../components/TourRegionNav' //version of PostCategoriesNav
import ListPageHeader from '../components/ListPageHeader' //version of PageHeader
import Layout from '../components/Layout'
import TourTagsNav from '../components/TourTagsNav' //version of PostCategoriesNav
import TourRegionsNav from '../components/TourRegionsNav' //version of TourTagsNav
import TourSectionNew from '../components/TourSectionNew' //simple function version of PostSection


const PlaceCatIndex = ({ pageContext, data }) => (

  <Location>
    {({ location }) => {

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

  //*Not used
//   let mainTitle
//   if (tag) {
//       mainTitle = place + "-" + tag
//   } else {
//       mainTitle = place
//   }
//   mainTitle = mainTitle + " ("+totalCount+")"

    let enableSearch = true,
    filteredPosts = posts 

    //* Add filter
    let queryObj = location.search.replace('?', '')
      queryObj = qs.parse(queryObj)

    if (enableSearch && queryObj.s) {
      const searchTerm = queryObj.s.toLowerCase()
      filteredPosts = posts.filter(post =>
        post.node.frontmatter.title.toLowerCase().includes(searchTerm)
      ) 
    }

  return (
    <Layout>

      <main className="Blog">
            <ListPageHeader
              place={place}
              tag={tag}
              count = {totalCount}
              //backgroundImage={featuredImage}
            />
            
            {!!arrAllRegions.length && (
                <section>
                <div className="container">
                    <TourRegionsNav enableSearch 
                    regions={arrAllRegions}
                    place = {place} />
                </div>
                </section>
            )}

            {!!arrTagsRegion.length && (
                <section>
                <div className="container">
                    <TourTagsNav 
                    tags={arrTagsRegion}
                    place = {place} />
                </div>
                </section>
            )}

            {/*START OF TOUR LISTING USING COMPONENT */}
            {!!filteredPosts.length && (
              <section className="section">
                <div className="container">
                  <TourSectionNew posts={filteredPosts} />
                </div>
              </section>
            )}

      </main>

    </Layout>
  );
  }}
  </Location>
)

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
              tourId
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