// https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
//! DIFFERENCE WITH NORMAL TOURLIST IS QRAPHQL WITH SIMPLER FILTER
//! Copy of ToursIndexPage4.js, but changing CSS from MUI
//! Adds location from @reach/router as TourIndex.js

//! This creates region/tag pages, eg http://localhost:8000/osa/adventure/


//* full version for tags
import React from 'react'; //! remove useState
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
// import DropMenuButton from "../components/DropMenuButton";
// import DropMenu from "../components/DropMenu";


const PlaceCatIndex = ({ pageContext, data }) => (

  <Location>
    {({ location }) => {

    const { tag, place, tagsRegion, allRegions } = pageContext;

    let { edges: posts, totalCount } = data.allMarkdownRemark;
    const arrTagsRegion = tagsRegion.split(",")
    const arrAllRegions = allRegions.split(",")

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


            {/*TOUR LISTING & SIDEBAR USING COMPONENTS WITH HOOKS */}
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
query($tag: String, $place: String) {
  allMarkdownRemark(
    limit: 2000
    sort: { fields: [frontmatter___price_from], order: ASC }
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