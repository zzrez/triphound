// https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
//! For full version see root/TourListFULL15jul19.js
//! Copy of ToursIndexPage4.js, but changing CSS from MUI

//! This creates region/tag pages, eg http://localhost:8000/osa/adventure/


//* full version for tags
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import qs from 'qs'


//import TourRegionNav from '../components/TourRegionNav' //version of PostCategoriesNav
import ListPageHeader from '../components/ListPageHeader' //version of PageHeader
import Layout from '../components/Layout'
import TourTagsNav from '../components/TourTagsNav' //version of PostCategoriesNav
import TourRegionsNav from '../components/TourRegionsNav' //version of TourTagsNav

//!New
import TourSectionNew from '../components/TourSectionNew' //simple function version of PostSection



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

  //*Not used
  // let mainTitle
  // if (tag) {
  //     mainTitle = place + "-" + tag
  // } else {
  //     mainTitle = place
  // }
  // mainTitle = mainTitle + " ("+totalCount+")"

    let startLimit = 12,
    showLoadMore = true,
    loadMoreTitle = 'Show More',
    perPageLimit = 12,
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
            {!!visiblePosts.length && (
              <section className="section">
                <div className="container">
                  <TourSectionNew posts={visiblePosts} />
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