// https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
//! DIFFERENCE WITH NORMAL TOURLIST IS QRAPHQL WITH SIMPLER FILTER
//! For full version see root/TourListFULL15jul19.js
//! Copy of ToursIndexPage4.js, but changing CSS from MUI
//! Adds location from @reach/router as TourIndex.js

//! This creates all tours page, http://localhost:8000/all/


//* full version for tags
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Location } from '@reach/router'
import qs from 'qs'


//import TourRegionNav from '../components/TourRegionNav' //version of PostCategoriesNav
import ListPageHeader from '../components/ListPageHeader' //version of PageHeader
import Layout from '../components/Layout'
// import TourTagsNav from '../components/TourTagsNav' //version of PostCategoriesNav
// import TourRegionsNav from '../components/TourRegionsNav' //version of TourTagsNav
import TourSectionNew from '../components/TourSectionNew' //simple function version of PostSection

//! changes re sidebar
import SideBar from '../components/SideBar'


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

            {/*TOUR LISTING USING COMPONENTS */}
            {!!filteredPosts.length && (
              <section className="section">
                <div className="container">
                  <div className="mainblock">                
                    <div className="aside">
                      <SideBar enableSearch 
                      regions={arrAllRegions}
                      tags={arrTagsRegion}
                      place = {place} 
                      tag={tag} />
                    </div>
                    <div className="content">
                      <TourSectionNew posts={filteredPosts} />
                    </div>
                  </div>
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
  query {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { contentType: { eq: "tours" } } }
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