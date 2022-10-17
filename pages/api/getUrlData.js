// FindMostFrequentWords returns a list of most frequent words along with their frequency, upto required number from a string
const FindMostFrequentWords = (str = '', num = 1) => {
  // Storing the words from the given string in a array
  const strArr = str.split(' ');
  const map = {};

  strArr.forEach(word => {
    // Check if the map have the word already, if yes then increase the count, else it is a new word, so count is 1
    if (map.hasOwnProperty(word)) {
      map[word]++;
    } else {
      map[word] = 1;
    }
  });

  // Converting object to a array
  const frequencyArr = Object.entries(map);

  // Sorting the items ascending to the word count
  frequencyArr.sort((a, b) => b[1] - a[1]);

  // Returning the frequent words upto the given required number
  return frequencyArr.slice(0, num);
};

// handler function handles the request coming to /api/getUrlData
export default function handler(req, res) {
  // if request method is POST then try fetching the contents of the url else, return wrong method status code (405) and end the connection.
  if (req.method === 'POST') {
    // Using try and catch clauses to catch any unexpected errors
    try {
      // Fetching the contents of the given url
      fetch(req.body.url)
        .then(rawData => rawData.json())
        .then(data => {
          let images = [];
          let descriptionsWords = "";
          let topTenWords = [];
          let topTenWordsCount = [];

          // Looping through the data, for storing all the images url into the Images list, and saving all the descriptions into one single string descriptionsWords
          data.map(item => {
            images.push(item.image)
            descriptionsWords += " " + item.description
          })

          // Using FindMostFrequentWords to find the most frequent words from descriptionsWords upto 10
          FindMostFrequentWords(descriptionsWords, 10).map(item=>{
            // Saving the top ten words into the topTenWords list
            topTenWords.push(item[0])
            // Saving the top ten words count into the topTenWordsCount parallel to the topTenWords
            topTenWordsCount.push(item[1])
          })

          // Returning the objects with 200 status code to the client
          res.status(200).json({ images: images, topTenWords: topTenWords, topTenWordsCount: topTenWordsCount })
          res.end()
        })
    } catch (err) {
      res.status(err).json({});
    }
  } else {
    res.status(405);
    res.end();
  }
}

