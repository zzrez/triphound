import React from 'react'
import { graphql } from 'gatsby'
import { Location } from '@reach/router'
import qs from 'qs'

//* names of imports kept same as BlogIndex (for moment)
import PageHeader from '../components/PageHeader'
import PostSection from '../components/TourSection' //version of PostSection
import PostCategoriesNav from '../components/TourCategoriesNav' //version of PostCategoriesNav
import TourRegionNav from '../components/TourRegionNav' //version of PostCategoriesNav
import Layout from '../components/Layout'

/**
 * Filter posts by date. Feature dates will be filtered
 * When used, make sure you run a cronejob each day to show schaduled content. See docs
 *
 * @param {posts} object
 */
export const byDate = posts => {
  const now = Date.now()
  return posts.filter(post => Date.parse(post.date) <= now)
}

/**
 * filter posts by category.
 *
 * @param {posts} object
 * @param {title} string
 * @param {contentType} string
 */
export const byRegion = (posts, title, contentType) => {
  const isRegion = contentType === 'region'
  const byRegion = post =>
    post.meeting &&
    post.meeting.filter(reg => reg.meeting === title).length
  return isRegion ? posts.filter(byRegion) : posts
}

export const byCategory = (posts, title, contentType) => {
  const isCategory = contentType === 'tourCategories'
  const byCategory = post =>
    post.categories &&
    post.categories.filter(cat => cat.category === title).length
  return isCategory ? posts.filter(byCategory) : posts
}

// Export Template for use in CMS preview
export const TourIndexTemplate = ({
  title,
  subtitle,
  featuredImage,
  region = [],
  posts = [],
  tourCategories = [],
  enableSearch = true,
  contentType
}) => (
  <Location>
    {({ location }) => {
      // let filterRegionPosts =
      // posts && !!posts.length
      //   ? byRegion(byDate(posts), title, contentType)
      //   : []

      // let filteredPosts =
      // filterRegionPosts && !!filterRegionPosts.length
      //   ? byCategory(byDate(filterRegionPosts), title, contentType)
      //   : []

      const isRegion = contentType === 'region'
      let filteredPosts =
      posts && !!posts.length && isRegion
        ? posts.filter(post =>post.meeting === title)
        : posts

      filteredPosts =
      filteredPosts && !!filteredPosts.length
        ? byCategory(byDate(filteredPosts), title, contentType)
        : []

      let queryObj = location.search.replace('?', '')
      queryObj = qs.parse(queryObj)

      if (enableSearch && queryObj.s) {
        const searchTerm = queryObj.s.toLowerCase()
        filteredPosts = filteredPosts.filter(post =>
          post.frontmatter.title.toLowerCase().includes(searchTerm)
        )
      }

      return (
        <main555 className="Blog222">
          <PageHeader
            title={title}
            subtitle={subtitle}
            backgroundImage={featuredImage}
          />

          {!!region.length && (
            <section555 className="section222 thin">
              <div className="container222">
                <TourRegionNav enableSearch places={region} />
              </div>
            </section>
          )}

          {!!tourCategories.length && (
            <section555 className="section2222 thin">
              <div className="container222">
                <PostCategoriesNav categories={tourCategories} />
              </div>
            </section>
          )}

          {!!posts.length && (
            <section555 className="section222">
              <div className="container222">
                <PostSection posts={filteredPosts} />
              </div>
            </section>
          )}
        </main>
      )
    }}
  </Location>
) //end TourIndexTemplate

// Export Default TourIndex for front-end
const TourIndex = ({ data: { page, posts, tourCategories, region } }) => (
  <Layout
    meta={page.frontmatter.meta || false}
    title={page.frontmatter.title || false}
  >
    <TourIndexTemplate
      {...page}
      {...page.fields}
      {...page.frontmatter}
      posts={posts.edges.map(post => ({
        ...post.node,
        ...post.node.frontmatter,
        ...post.node.fields
      }))}

      region={region.edges.map(post => ({
        ...post.node,
        ...post.node.frontmatter,
        ...post.node.fields
      }))}
    />
  </Layout>
)

export default TourIndex

//* query TourIndex gets data for top of tour listing page,
//* posts: allMarkdownRemark for the tours etc
export const pageQuery = graphql`
  ## Query for TourIndex data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file

  ## This gets data for the template top itself
  query TourIndex($id: String!) {
    page: markdownRemark(id: { eq: $id } ) {
      ...Meta
      fields {
        contentType
      }
      frontmatter {
        title
        excerpt
        template
        subtitle
        featuredImage
      }
    }

    ## This gets data for the tours
    posts: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "tours" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            categories {
              category
            }
            tags
            price_from
            featuredImage
            meeting
          }
        }
      }
    }
    ## This gets data for the regions
    region: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "region" } } }
      sort: { order: ASC, fields: [frontmatter___title] }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
}
`
