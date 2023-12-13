import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, ref as dbRef, set, push } from "firebase/database";

export async function pickImage() {
  let result = ImagePicker.launchCameraAsync();
  return result;
}

export async function uploadImage(uri, path, fName) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileName = fName || uuidv4();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  blob.close();

  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName };
}

export function sendMessage(sender, receiver, message, type) {
  const timestamp = new Date();
  const data = {
    sender,
    receiver,
    // timestamp: firebase.database.ServerValue.TIMESTAMP,
    message,
    type,
    id: uuidv4(),
  };
  console.log("data beaaach: ", data);
  try {
    const db = getDatabase();
    const messagesRef = dbRef(db, "messages/" + getChatID(sender, receiver));
    const newMessageRef = push(messagesRef);
    set(newMessageRef, data);
  } catch (error) {
    console.log(error);
  }
}

export function getChatID(senderId, receiverId) {
  const restrictedChars = [".", "#", "$", "[", "]"];
  const [minStr, maxStr] = [senderId, receiverId].sort();
  const combinedString = `${minStr}-${maxStr}`;

  return combinedString
    .split("")
    .filter((c) => !restrictedChars.includes(c))
    .join("");
}

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const colors = {
  primary: "#6650A4",
  border: "#DADDE1",
};
