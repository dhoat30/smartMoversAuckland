//get single post with slug 
export const getSinglePostData = async (slug, apiRoute) => {
    let response = await fetch(`${process.env.url}/${apiRoute}?slug=${slug}&acf_format=standard`, {
        next: { revalidate: 60 },
    });
    let data = await response.json();
    return data
}


// get single post data using post id 
export const getSinglePostDataWithID = async (id, apiRoute) => {
    let response = await fetch(`${process.env.url}/${apiRoute}/${id}?acf_format=standard`, {
        next: { revalidate: 60 },
    });
    let data = await response.json();
    return data
}

//get all posts 
export const getAllPosts = async (apiRoute) => {
    let response = await fetch(`${process.env.url}/${apiRoute}?acf_format=standard&per_page=100`, {
        next: { revalidate: 60 },
    });
    let data = await response.json();
    return data
}


export const getOptions = async () => {
    let fetchData = await fetch(`${process.env.url}/wp-json/options/all`, {
        next: { revalidate: 60 },
    });
    let data = await fetchData.json();
    return data
}





// get reivews 
// get reivews
export const getGoogleReviews = async () => {
    const baseUrl = process.env.siteUrl; // Change this in production

    const res = await fetch(`${baseUrl}/api/google-reviews`, { next: { revalidate: 30 * 86400 } });

    if (!res.ok) { 
        console.log("failed to retch")
    return []
    }
    return res.json();
  
};



