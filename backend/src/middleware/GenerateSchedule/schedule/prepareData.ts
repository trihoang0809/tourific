export const activityData = async (userActivityData: any) => {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
  const getDistance = async (originLa: number, originLong: number, destinationLa: number, destinationLong: number) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLa},${originLong}&destination=${destinationLa},${destinationLong}&mode=driving&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      return data.routes[0].legs[0].distance.value;
    } catch (error) {
      console.log("An error happens while fetching ggMap Direction: " + error);
    }
  };

  if (userActivityData.length > 0) {
    let userActivityDistance: any = [];

    for (let i = 0; i < userActivityData.length; ++i) {
      userActivityDistance.push([]);
      for (let j = 0; j < userActivityData.length; ++j) userActivityDistance[i].push(0);
    }

    for (let i = 0; i < userActivityData.length; ++i) {
      for (let j = i + 1; j < userActivityData.length; ++j) {
        const distance = await getDistance(
          userActivityData[i].location.latitude,
          userActivityData[i].location.longitude,
          userActivityData[j].location.latitude,
          userActivityData[j].location.longitude
        );
        userActivityDistance[i][j] = distance;
        userActivityDistance[j][i] = distance;
      }
    }

    return userActivityDistance;
  } else return [];
};
