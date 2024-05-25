export const noImage =
  "https://img.freepik.com/premium-vector/train-railway-summer-landscape-vector-illustration_357257-527.jpg";
export const defaultAvatar =
  "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/02/avatar-the-last-airbender-7-essential-episodes.jpg";

export const headerImage = [
  "https://cdn.dribbble.com/users/1312159/screenshots/10770935/media/55450d77089a7b0f740f7c70f9c44fa3.png",
  "https://png.pngtree.com/png-vector/20221021/ourmid/pngtree-happy-couples-traveling-in-europe-and-taking-photo-isolated-flat-vector-png-image_6334096.png",
  "https://cdn.dribbble.com/users/1312159/screenshots/10960634/media/d6321493106c2549b2eb81c382bee7ec.png?resize=400x300&vertical=center",
  "https://afar.brightspotcdn.com/dims4/default/cdb8adc/2147483647/strip/true/crop/4185x2208+0+1140/resize/527x278!/quality/90/?url=https%3A%2F%2Fafar-media-production-web.s3.us-west-2.amazonaws.com%2Fbrightspot%2Fc7%2Ff3%2Fdb40a0cd49718ff7941aa86902b7%2Fshutterstock-2111434766.jpg"
];

export function randomizeCover(images: string[]) {
  const idx = Math.floor(Math.random() * images.length);
  return images[idx];
}

