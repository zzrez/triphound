
//! TO ADJUST TO Triphound
//! Use: node create-md-tours-triphound
//! This uses turndown to convert includes from html to md.
//* Changes vs create-md-toursTESTNEW: add Tags, Lat/Lng, remove category pages
//* Version of create-md-supplier.js (in scrape-cr-suppliers), saves in folder src/pages/tours/

//! Define initial parameters
let supplier_id
let limit
//supplier_id = 3
limit = 120
//! End

if (supplier_id) {
    sqlSupplier = ` WHERE supplier_id=${supplier_id}`
} else {
    sqlSupplier = ""
}
if (limit) {
    sqlLimit = ` LIMIT ${limit}`
} else {
    sqlLimit = ""
}

const fs = require('fs')
const mysql = require('mysql')
const dbase = "sreztours" //* INDICATE DATABASE
const toursTable = "tours" //* INDICATE TABLE TO USE FOR INSERTING/UPDATING TOURS
const TurndownService = require('turndown')
let turndownService = new TurndownService({codeBlockStyle:'fenced'})

if (dbase == "apitests") {//* Test DB with GearHost
    con = mysql.createConnection({
        host: "den1.mysql2.gear.host",
        user: "apitests",
        password: "Zd9tiDeR-?qB",
        port: 3306,
        database: "apitests"
    });
}
else if (dbase == "sreztours") {//* Main DB with GearHost
    con = mysql.createConnection({
        host: "den1.mysql3.gear.host",
        user: "sreztours",
        password: "Qu030m-113-P",
        port: 3306,
        database: "sreztours"
    });
}

let mdAll = ""
let imgs = []
let allCats = []
let allMeetings = []

const adjText = function(text) { //*to adjust text (not html)
    if (text){
        //text = text.replace(/'/g,"&apos;").trim() //* escape apostrophe
        text = text.replace(/\s+/ig, ' ') //*replace white space with 1 space
        //text = text.replace(/\*/ig,"-")
        text = text.replace(/%20/ig,"-") //replace spaces
        text = text.replace(/%26/ig,"-") //replace &
        text = text.replace(/%22/ig,"-") //replace "
        text = text.replace(/%/ig,"")
        text = text.replace(/"/ig,"")
    } else {
        text = ""
    }
    return text
}

const adjHtml = function(text) { //*to adjust html
    if (text){
        text = text.replace(/'/g,"&apos;").trim() //* escape apostrophe
        text = text.replace(/\s+/ig, ' ') //*replace white space with 1 space
        //text = text.replace(/\*/ig,"-")
        //text = text.replace(/%/ig,"")
        text = text.replace(/"/ig,"%22")
    } else {
        text = ""
    }
    return text
}

const dbGetData = (id) => {
    con.connect(function(err) {
        if (err) throw err;
        con.query(`SELECT tour_id, title, supplier_url, supplier, supplier_id, summary, main_photo, includes, bring, advice, description, price_from, categories, min_participants, start_time_text, duration_text, price_adult, price_child, price_student, max_participants, highlights, highlights2, meeting, meeting_lat, meeting_lng, location_id, meeting_id, difficulty, excludes, accom FROM ${toursTable} ${sqlSupplier} ${sqlLimit}`, function (err, result, fields) {
            if (err) throw err;

            for (let i = 0; i < result.length; i++) {

                let tour_id = result[i].tour_id
                let tourTitle = adjText(result[i].title)
                let supplier_url = result[i].supplier_url
                let supplier = result[i].supplier
                let supplier_id = result[i].supplier_id
                let location_id = result[i].location_id
                let meeting_id = result[i].meeting_id
                let difficulty = result[i].difficulty
                let summary = adjText(result[i].summary)
                let includes = adjHtml(result[i].includes)
                let bring = adjHtml(result[i].bring)
                let highlights = adjHtml(result[i].highlights)
                let highlights2 = adjHtml(result[i].highlights2)
                let advice = adjHtml(result[i].advice)
                //let advice = result[i].advice
                let excludes = adjHtml(result[i].excludes)
                let accom = adjHtml(result[i].accom)
                let description = result[i].description
                let main_photo = result[i].main_photo
                let price_from = result[i].price_from
                let price_adult = result[i].price_adult
                let price_child = result[i].price_child
                let price_student = result[i].price_student
                let categories = result[i].categories
                let min_participants = result[i].min_participants
                let max_participants = result[i].max_participants
                let start_time_text = result[i].start_time_text
                let duration_text = result[i].duration_text
                let meeting = result[i].meeting
                let meeting_lat = result[i].meeting_lat
                let meeting_lng = result[i].meeting_lng

                //* get distinct meeting places for md pages
                if (!!allMeetings.length) { //allMeetings not empty
                    if (!allMeetings.includes(meeting)) {
                        allMeetings.push(meeting)
                    }
                } else { //allMeetings empty
                    allMeetings.push(meeting)
                }

                //* process categories (1) for each tour (2) for md pages
                let cats //for categories
                let tags //for tags
                if (!!categories && categories.includes(",")) { //has several categories
                    let cat_array = categories.split(',');

                    for(let j = 0; j < cat_array.length; j++) {
                        //* (1) for each tour
                        cat_array[j] = cat_array[j].replace(/^\s*/, "").replace(/\s*$/, "");
                        cat_array[j] = cat_array[j].charAt(0).toUpperCase() + cat_array[j].slice(1)
                        if (cats) {
                            cats = cats +"\n  - category: " + cat_array[j]
                        } else {
                            cats = "\n  - category: " + cat_array[j]
                        }
                        if (tags) {
                            tags = tags + ", '" + cat_array[j] + "'"
                        } else {
                            tags = "'" + cat_array[j] + "'"
                        }
                        //* (2) for md pages of the cats (not needed!)
                        if (!!allCats.length) { //allCats not empty
                            if (!allCats.includes(cat_array[j])) {
                                allCats.push(cat_array[j])
                            }
                        } else {
                            allCats.push(cat_array[j])
                        }
                    } //end of loop through cat_array

                } else if (!!categories) { //has one category
                    categories = categories.charAt(0).toUpperCase() + categories.slice(1)
                    //* (1) for each tour
                    cats = "\n  - category: " + categories
                    tags = "'" + categories + "'"
                    //* (2) for md pages of the cats (not needed!)
                    if (allCats) { //allCats not empty
                        if (!allCats.includes(categories)) {
                            allCats.push(categories)
                        }
                    } else {
                        allCats.push(categories)
                    }
                } else { //has no categories
                    //* (1) for each tour
                    cats = "\n  - category: ''"
                    tags = ""
                }
                tags = "[" + tags + "]" //* required format for array of tags in MD


                if (min_participants) {
                    min_participants = min_participants
                } else {
                    min_participants = ''
                }
                if (max_participants) {
                    max_participants = max_participants
                } else {
                    max_participants = ''
                }

                if (summary) {
                summary = summary.replace(/(<([^>]+)>)/ig,"") //remove html
                } else if (description) {
                summary = description.replace(/(<([^>]+)>)/ig,"") //remove html
                summary = summary.substring(0, 280)+"...."
                }
                summary = summary.replace(/"/ig,"") //replace "
                summary = adjText(summary).trim()

                // if (description) {
                //     summary = description.replace(/(<([^>]+)>)/ig,"");
                //     summary = summary.substring(0, 280)+"....";
                // }
                let seo_description = "Costa Rica tour "+tourTitle+", id "+tour_id
                let title_hyphen = encodeURIComponent(tourTitle).toLowerCase()
                title_hyphen = title_hyphen.replace(/\*/ig,"-")
                title_hyphen = adjText(title_hyphen)

                // title_hyphen = title_hyphen.replace(/\*/ig,"-")
                // title_hyphen = title_hyphen.replace(/%20/ig,"-") //replace spaces
                // title_hyphen = title_hyphen.replace(/%26/ig,"-") //replace &
                // title_hyphen = title_hyphen.replace(/%22/ig,"-") //replace "
                // title_hyphen = title_hyphen.replace(/%/ig,"")
                // title_hyphen = title_hyphen.replace(/"/ig,"")

                //! Get media from gallery for this tour
                    query = `SELECT media_url FROM media WHERE supplier_id=${supplier_id} AND source_type='gallery' AND tour_id=${tour_id}`
                con.query(query, function (err, result, fields) {
                    if (err) throw err;
                    const media = JSON.parse(JSON.stringify(result))
                    imgs.length = 0 //reset

                    media.forEach(function(value) {
                        idValue = Object.values(value);
                        imgs.push(...idValue)
                    });

                    //* If main_photo null, select 1st photo of array
                    if (!main_photo && imgs.length>0) {
                        main_photo = imgs[0]
                    }
                    //console.log("main_photo="+main_photo)
                    //* This query ends below so value can be passed

                    if (includes) { //* convert to markdown
                        //includes = includes.replace("<ul>", "|-")
                        // includes = includes.replace("<ul>", "")
                        // includes = includes.replace(/<li>/gi, "\n* ")
                        // includes = includes.replace(/<\/li>/gi, "")
                        // includes = includes.replace("</ul>", "")
                        includes = turndownService.turndown(includes)
                    }

                    //* convert main description to markdown
                    description = turndownService.turndown(description)

                    highlights = turndownService.turndown(highlights)
                    highlights2 = turndownService.turndown(highlights2)
                    excludes = turndownService.turndown(excludes)
                    bring = turndownService.turndown(bring)
                    advice = turndownService.turndown(advice)
                    accom = turndownService.turndown(accom)
//! changes jsx below:-
//gallery: "${imgs}"
//add featuredImage

//! added: tags

//!CONFIGURE MD PAGE
let frontMatter = `---
template: SingleTour
tourId: ${tour_id}
date: "${new Date(Date.now())}"
title: "${tourTitle}"
categories: ${cats}
tags: ${tags}
meeting: "${meeting}"
meeting_lat: "${meeting_lat}"
meeting_lng: "${meeting_lng}"
description: "${seo_description}"
price_from: ${price_from}
min_participants: ${min_participants}
max_participants: ${max_participants}
start_time_text: "${start_time_text}"
duration_text: "${duration_text}"
price_adult: ${price_adult}
price_child: ${price_child}
price_student: ${price_student}
meeting_id: ${meeting_id}
location_id: ${location_id}
difficulty: "${difficulty}"
summary: "${summary}"
image: "${main_photo}"
main_photo: "${main_photo}"
featuredImage: "${main_photo}"
highlights: "${highlights}"
highlights2: "${highlights2}"
includes: "${includes}"
excludes: "${excludes}"
bring: "${bring}"
advice: "${advice}"
accom: "${accom}"
---
`
mdAll = frontMatter+description

                //!CREATE MD PAGES FOR TOURS
                if (main_photo) { //*only if have photo
                    //const outputFile = `./src/pages/tours/${supplier_id}-${title_hyphen}-${tour_id}.md`
                    const outputFile = `${tour_id}-${title_hyphen}-${supplier_id}.md`
                    const outputFilePath = `./content/tours/${outputFile}`
                    fs.writeFile(outputFilePath, mdAll, function (err) {
                        if (err) console.log(err)
                        //console.log(`${outputFile}`)
                    })
                }
                

                }); //end of query for more media (line 116)

                if (i == result.length-1) {
                    console.log(`(${i+1} tour pages created)`)
                    console.log(`Regions (allMeetings array):-`)
                    console.log(allMeetings)
                    console.log(`All categories (allCats array):-`)
                    console.log(allCats)
                    //console.log(`result.length = ${result.length}`)

                    // CREATE MD CATEGORIES PAGES
//                     for(let k = 0; k < allCats.length; k++) { //1st letter is upper case
//                         let lTitle = allCats[k].toLowerCase()

// let mdCat = `---
// template: TourIndex
// title: ${allCats[k]}
// subtitle: ''
// featuredImage: 'https://ucarecdn.com/db0b1431-8739-426f-970d-8a80eacf02ef/-/preview/-/rotate/270/'
// ---
// `
//                         const outputFileCat = `${lTitle}.md`
//                         const outputFilePathCat = `./content/tourCategories/${outputFileCat}`
//                         fs.writeFile(outputFilePathCat, mdCat, function (err) {
//                             if (err) console.log(err)
//                         })
//                         if (k == allCats.length-1) {
//                             console.log(`(${k+1} category pages created)`)
//                         }
//                     }

                    //!CREATE MD MEETING PLACES PAGES (REGION)
                    for(let m = 0; m < allMeetings.length; m++) { //1st letter is upper case
                        let lTitleRegion = allMeetings[m].toLowerCase()

let mdRegion = `---
template: TourIndex
title: ${allMeetings[m]}
subtitle: ''
featuredImage: 'https://ucarecdn.com/db0b1431-8739-426f-970d-8a80eacf02ef/-/preview/-/rotate/270/'
---
`
                        const outputFileRegion = `${lTitleRegion}.md`
                        const outputFilePathRegion = `./content/region/${outputFileRegion}`
                        fs.writeFile(outputFilePathRegion, mdRegion, function (err) {
                            if (err) console.log(err)
                        })
                        if (m == allMeetings.length-1) {
                            console.log(`(${m+1} region pages created)`)
                        }
                    }
                }
                //console.log(`i = ${i}`)

            } //* end of loop through results

        });
    });

}

dbGetData(supplier_id)

//con.end()