import {app} from "./FirebaseConfig";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

export const auth = getAuth(app);
export const storage = getStorage(app);
