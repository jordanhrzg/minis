const axios = require('axios');

const BASE_URL = 'https://api.harvardartmuseums.org/';
const API_KEY = '?apikey=f3b65280-938f-11ea-964c-9d06ee6677be';

/**
 * This function queries the specified section of the Harvard Art API and returns
 * the total number of entries and an array of categories & their counts.
 *
 * @returns {Promise<void>} object with array of records (name-count) and
 *      total number of entries
 */
module.exports.getSection = async (section) => {
    let results = {};
    //API call - get number of results to fetch
    let initial = BASE_URL + section + API_KEY;
    let numResults = await axios.get(initial);
    numResults = numResults.data.info.totalrecords;

    //API call - get results & map to name-count pairs
    const final = initial + `&size=${numResults}`;
    let finalResults = await axios.get(final);
    results.records = finalResults.data.records.map(record => {
        return {
            name: record.name,
            count: record.objectcount
        }
    });
    //include total number of results in return
    results.total = numResults;
    results.category = section;

    return results;
};

//keyword
//technique
//culture
//century
module.exports.search = async (terms) => {
    let results = {};

    let query = `${BASE_URL}object${API_KEY}`;
    query = query.concat('&hasImage=1');

    if(terms.keyword){
        let keyword = encodeURI(terms.keyword);
        query = query.concat(`&keyword=${keyword}`);
    }

    if(terms.technique.selected){
        let technique = encodeURI(terms.technique.selected);
        query = query.concat(`&technique=${technique}`);
    }

    if(terms.century.selected){
        let century = encodeURI(terms.century.selected);
        query = query.concat(`&century=${century}`);
    }

    if(terms.culture.selected){
        let culture = encodeURI(terms.culture.selected);
        query = query.concat(`&culture=${culture}`);
    }

    //make API call and save target data (image url, artist name, century, technique, culture)
    await axios.get(query)
        .then(function (response) {
            //API may return multiple results, return data for 1st record only
            let targetRecord = response.data.records[0];
            results = (targetRecord) ? [targetRecord].map(t => {
                return {
                    title: t.title,
                    people: t.people,
                    technique: t.technique,
                    century: t.century,
                    culture: t.culture,
                    image: t.primaryimageurl
                }
            }) : null;
        });

    return ((results) ? results[0] : results);
};