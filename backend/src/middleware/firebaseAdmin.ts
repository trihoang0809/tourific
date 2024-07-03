import admin from "firebase-admin";
import * as serviceAccount from "../../tourific-51d82-firebase-adminsdk-yjuey-577f74f6ed.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
