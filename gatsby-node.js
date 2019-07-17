//! Creates region/tag pages using lodash and normal array. See Tag pages section of https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files

const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            frontmatter {
              template
              title
              categories {
                category
              }
              tags
              meeting
            }
            fields {
              slug
              contentType
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const mdFiles = result.data.allMarkdownRemark.edges

    const contentTypes = _.groupBy(mdFiles, 'node.fields.contentType')
    // contentType: tours, posts, infoPages, postCategories, pages

    _.each(contentTypes, (pages, contentType) => {
      const pagesToCreate = pages.filter(page =>
        // get pages with template field
        _.get(page, `node.frontmatter.template`)
      )

      if (!pagesToCreate.length) return console.log(`Skipping ${contentType}`)

      console.log(`\nCreating ${pagesToCreate.length} ${contentType}`)

      // if (node.frontmatter.template === "TourIndex") {
      //   const idTourIndex = node.id
      // }

      pagesToCreate.forEach((page, index) => {
        const id = page.node.id
        let thisSlug = page.node.fields.slug
        createPage({
          // page slug set in md frontmatter
          path: page.node.fields.slug,
          component: path.resolve(
            `src/templates/${String(page.node.frontmatter.template)}.js`
          ),
          // additional data can be passed via context
          context: {
            id
          }
        })

        console.log(`contentType = ${contentType}`)
        console.log(`id = ${id}`)
        console.log(`slug = ${thisSlug}`)
        // console.log(`component = ${component}`)
      })

      //* NEW SECTION FOR TOURS
      if (contentType === "tours") {
        console.log(`\nCreating regional ${contentType} lists`)

        //* create array allRegions of regions
        let allRegions = []
        // Iterate through each post, putting all found meeting into `allRegions`
        _.each(mdFiles, edge => {
          if (_.get(edge, "node.frontmatter.meeting")) {
            allRegions = allRegions.concat(edge.node.frontmatter.meeting)
          }
        })
        // Eliminate duplicates
        allRegions = _.uniq(allRegions)
        //* end new regions

        console.log(`allRegions:-`)
        console.log(allRegions)

        //* for each region, define tours for each tag, tags (allTagsRegion) & tour count
        allRegions.forEach(element => { //element = region
          let mdFilesRegion
          if (element) {
            mdFilesRegion = mdFiles.filter(post =>post.node.frontmatter.meeting === element)
            console.log("\n"+element+":-");
          } else {
            mdFilesRegion = mdFiles
            console.log("\nAll country:-");
          }
          let countToursRegion = mdFilesRegion.length
          console.log("# tours (countToursRegion) = "+countToursRegion);

          //* define tags for region (allTagsRegion)
          let allTagsRegion = []
          // Iterate through each post, putting all found tags into `allTagsRegion`
          _.each(mdFilesRegion, edge => {
            if (_.get(edge, "node.frontmatter.tags")) {
              allTagsRegion = allTagsRegion.concat(edge.node.frontmatter.tags)
            }
          })
          // Eliminate duplicates
          allTagsRegion = _.uniq(allTagsRegion)
          //* end new tags

          console.log(`Distinct tags for region (allTagsRegion):-`)
          console.log(allTagsRegion)
          //id = idTourIndex
          //templateSlug = element

          //* for each region & tag, define slug & create page
          allTagsRegion.forEach(item => { //item = tag
            if (element) {
              thisSlug = "/"+element.toLowerCase()+"/"+item.toLowerCase()+"/"
            } else {
              thisSlug = "/tours/"+item.toLowerCase()+"/"
            }
            template = "TourList" //
            //TourIndexRegions fails to get pageContext
            //TourList correct for pageContext, regions/tags, with YC format
            //was ToursIndexPage4 with MUI
            //ToursIndexPage2 shows correct tours, + MUI cards
            //ToursIndexPage shows the correct tours for given region & tag, but no cards
            // as problem with defining "posts" so that cards show in correct format
            //TourIndexPage shows cards for all tours, but does not get pagecontext
            console.log("slug = "+thisSlug);
            createPage({
              path: thisSlug,
              component: path.resolve(`src/templates/${String(template)}.js`),
              context: {
                place: element,
                tag: item,
                tagsRegion: allTagsRegion.toString(),
                allRegions: allRegions.toString(),
              }
            })
          });

          //* for each region alone, define slug & create page
          template = "TourListRegion" //removes tag from graphql
          //was ToursIndexPage4reg, which uses MUI
          thisSlug = "/"+element.toLowerCase()+"/"
          console.log("slug = "+thisSlug)
          createPage({
            path: thisSlug,
            component: path.resolve(`src/templates/${String(template)}.js`),
            context: {
              place: element,
              tag: '',
              tagsRegion: allTagsRegion.toString(),
              allRegions: allRegions.toString(),
            }
          })

        }); //end allRegions.forEach

        //* define all tags
        let allTags = []
        // Iterate through each post, putting all found tags into `allTags`
        _.each(mdFiles, edge => {
          if (_.get(edge, "node.frontmatter.tags")) {
            allTags = allTags.concat(edge.node.frontmatter.tags)
          }
        })
        // Eliminate duplicates
        allTags = _.uniq(allTags)
        //* end new tags

        console.log(`allTags:-`)
        console.log(allTags)

        //* for all tours in country, define slug & create page
        template = "TourListAll" //removes tag from graphql
        thisSlug = "/all/"
        console.log("slug = "+thisSlug)
        createPage({
          path: thisSlug,
          component: path.resolve(`src/templates/${String(template)}.js`),
          context: {
            place: '',
            tag: '',
            tagsRegion: allTags.toString(),
            allRegions: allRegions.toString(),
          }
        })

        //* NEW for each tag for whole country, define slug & create page
        allTags.forEach(item => { //item = tag
          thisSlug = "/all/"+item.toLowerCase()+"/"
          template = "TourListTag" //
          console.log("slug = "+thisSlug);
          createPage({
            path: thisSlug,
            component: path.resolve(`src/templates/${String(template)}.js`),
            context: {
              place: '',
              tag: item,
              tagsRegion: allTags.toString(),
              allRegions: allRegions.toString(),
            }
          })
        });        

      } //* END SECTION FOR TOURS

    })
  }) //* end then
} //* end create page by contentType

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // convert frontmatter images
  fmImagesToRelative(node)

  // Create smart slugs
  // https://github.com/Vagr9K/gatsby-advanced-starter/blob/master/gatsby-node.js
  let slug
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)

    if (_.get(node, 'frontmatter.slug')) {
      slug = `/${node.frontmatter.slug.toLowerCase()}/`
    } else if (
      // home page gets root slug
      parsedFilePath.name === 'home' &&
      parsedFilePath.dir === 'pages'
    ) {
      slug = `/`
    } else if (_.get(node, 'frontmatter.title')) {
      slug = `/${_.kebabCase(parsedFilePath.dir)}/${_.kebabCase(
        node.frontmatter.title
      )}/`
    } else if (parsedFilePath.dir === '') {
      slug = `/${parsedFilePath.name}/`
    } else {
      slug = `/${parsedFilePath.dir}/`
    }

    console.log(`\nparsedFilePath.name = ${parsedFilePath.name}`)
    console.log(`parsedFilePath.dir = ${parsedFilePath.dir}`)
    console.log(`slug = ${slug}`)

    createNodeField({
      node,
      name: 'slug',
      value: slug
    })

    // Add contentType to node.fields
    createNodeField({
      node,
      name: 'contentType',
      value: parsedFilePath.dir
    })
  }
}

// Random fix for https://github.com/gatsbyjs/gatsby/issues/5700
module.exports.resolvableExtensions = () => ['.json']
