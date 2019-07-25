# TRIPHOUND
## 2019-07-25
Solve filter & more results for TourListALL.js.
After adding in Location (@reach/router), filter works in TourListAll-filter-notstate25jul19.js
But useState hook for showing more results fails.
Solved by moving useState hook for showing more results from tourlist page to TourSectionNew.js 

TourSearch.js, copy of BlogSearch, used in TourSectionNew.js

TourListALL.js (was TourListAll24jul19) used to create:-
TourList.js (previous TourList-slice25jul19.js)
TourListTag.js (previous TourListTag-slice25jul19.js)
TourListRegion.js (previous TourListRegion-slice25jul19.js)
Previous all included useState hook for showing more results.
DIFFERENCE BETWEEN THESE TEMPLATES: top of graphql, and note at top

## 2019-07-24
Try to solve filter of TourListALL.js, fail
Put TourSearch instead of BlogSearch in TourRegionsNav.js. 
Save old copies in folder Copies. But filter of TourListALL.js fails.

## 2019-07-16
Remove ' className="section thin"' from lines 87 & 97 of tour list templates
Run create-md-tours-triphound.js, problem with tags. NW "tags: Rainforest,4x4,Canopy"
Previously: "tags: ['Adventure', 'Atv']"

## 2019-07-15
TourList.js, TourListRegion.js, TourListTag.js, TourListAll.js are new tour list templates
As components these now include main tour part, TourSectionNew.js, & ListPageHeader.js
Must still do search filter, see Notebook. Old template in root, TourListFULL15jul19.js

## 2019-07-12
Copy TourIndex.js to TourIndexRegions.js and try and get pageContext for region/tag pages. FAILS.
Create TourList.js as tours listing page for region/tag pages, using YC format not MUI. Filter NW.

## 2019-07-11
Copy from srezcake2, and then pages deleted. No git yet.
Beware removing page & template ComponentsPage.js, is also used in src/cms/cms.js

# SREZCAKE2
## 2019-07-10
Copy from gatsby-blog-lunr & add in plugin gatsby-plugin-lunr.js:-
- gatsby-config.js
- components/searchResults.js & searchForm.js
- pages/search.js (there is already components/Search.js)
- in Nav.js, <NavLink to="/search">Search all tours</NavLink>

## 2019-07-08
ToursIndexPage3.js has Show More, along with counter. ToursIndexPage4.js & ToursIndexPage4reg.js, 
without counter, now used.

## 2019-07-04
ToursIndexPage2.js template for all region/tag pages, working with MaterialUI
Includes TourRegionsNav.js, TourTagsNav.js
[ToursIndexPage.js shows correct data without formatted cards,
TourIndexPage.js uses previous format with all tours, no use of pageContect]

# YELLOWCAKE
## 2.0.7 - 2019-03-27

Upgrade CMS version.
Fix broken image in preview when title is filled in.

## 2.0.6 - 2019-01-22

BackgroundVideo Component set poster for mobile width window.

## 2.0.5 - 2019-01-22

Offline support with prefetch 10px images from Uploadcare.
Single post layout update to remove background image.

## 2.0.4 - 2019-01-21

New lazy image component and a bunch of errors.

- instagram load + cache items
- video bg z-index
- post search bar responsiveness

## 2.0.3 - 2019-01-16

Add background video component with fade in over poster image by default.
Inline images through markdown editor now use Image component.

## 2.0.2 - 2018-11-06

Add SVG icon component
It allows you to change color of the icon in css with background of .SVGIcon--icon

## 2.0.1.1 - 2018-10-28

add accordion

## 2.0.1 - 2018-10-18

Configure Uploadcare widget  
Image component setup  
Add google maps

## 2.0.0 - 2018-10-15

Init Yellow cake
