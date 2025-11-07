//get single post with slug 
export const getSinglePostData = async (slug, apiRoute) => {
  console.log("Fetching from API:", slug);

    try {
      const url = `${process.env.url}/${apiRoute}?slug=${slug}&acf_format=standard`;
      console.log("Fetching:", url);
  
      const response = await fetch(url, 
        {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json',
            },
            next: { revalidate: 2592000 },
          }
    );
  
      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error in getSinglePostData:", err);
      return null;
    }
  };

// get single post data using post id 
export const getSinglePostDataWithID = async (id, apiRoute) => {
    let response = await fetch(`${process.env.url}/${apiRoute}/${id}?acf_format=standard`, {
        next: { revalidate: 2592000 },
    });
    let data = await response.json();
    return data
}

//get all posts 
export const getAllPosts = async (apiRoute) => {
    let response = await fetch(`${process.env.url}/${apiRoute}?acf_format=standard&per_page=100`, {
        next: { revalidate: 2592000 },
    });
    let data = await response.json();
    return data
}


export const getOptions = async () => {
    let fetchData = await fetch(`${process.env.url}/wp-json/options/all`, {
        next: { revalidate: 2592000 },
    });
    let data = await fetchData.json();
    return data
}
export const getLongDistanceRoutes = async () => {
    let fetchData = await fetch(`${process.env.url}/wp-json/smart/v1/long-distance-moves`, {
        next: { revalidate: 2592000 },
    });
    let data = await fetchData.json();
    return data
}





  // get reivews
  export const getGoogleReviews = async () => {
    const baseUrl = process.env.siteUrl; // Change this in production

    const res = await fetch(`${baseUrl}/api/google-reviews`, { next: { revalidate: 2592000 } });

    if (!res.ok) { 
        console.log("failed to retch")
    return []
    }
    return res.json();
  
};




// const axios = require("axios");

// const data = JSON.stringify([
// 	{"url":"https://www.google.com/maps/place/Best+NZ+Movers/@-37.0505295,174.8591432,12z/data=!4m6!3m5!1s0x6d72ad599064635b:0x6c0ae0912c7f3416!8m2!3d-37.050558!4d174.9415442!16s%2Fg%2F11ybzp6jf6?hl=en-GB&authuser=0&entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D","days_limit":18},
// ]);

// axios
//     .post("https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_luzfs1dn2oa0teb81&include_errors=true",
// 		data,
//         {
//             headers: {
// 				"Authorization": "Bearer d5991053-4d54-4922-9482-5bab1d20f59c",
// 				"Content-Type": "application/json",
// 			},
//         }
//     )
//     .then((response) => console.log(response.data))
//     .catch((error) => console.error(error));