export const funScore = async (activity: any, participant: number) => {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";

  // Get rating of activities on Gg map
  // Scale: [0, 1] --> ratings/5
  const getRating = async () => {
    let ratings = [];
    for (let i = 0; i < activity.length; ++i) {
      if (activity[i].googlePlacesId !== "") {
        const placeDetailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${activity[i].googlePlacesId}&key=${GOOGLE_PLACES_API_KEY}`;
        const placeDetail = await fetch(placeDetailUrl);
        const placeData = await placeDetail.json();
        ratings.push(placeData.result.rating / 5 || 0.5);
      } else ratings.push(0.5);
    }
    return ratings;
  };

  const ratings = await getRating();

  // Percentage of how many people want to go for this activities
  const upvotes = activity.map((activity: any, id: number) => activity.netUpvotes / participant);
  let score = [];

  for (let i = 0; i < upvotes.length; ++i) {
    score.push(0.7 * 0.8 * upvotes[i] + 0.3 * 0.8 * ratings[i]);
  }

  return score;
};
