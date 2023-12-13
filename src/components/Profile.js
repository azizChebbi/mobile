/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import firebase, { auth, db } from "../../firebase/config";
import { updateProfile } from "firebase/auth";
import { addDoc, setDoc, doc, collection, getDoc } from "firebase/firestore";
import { pickImage, uploadImage } from "../helpers";
import { Button, TextInput } from "react-native-paper";

const user = auth.currentUser;

const MyAccount = ({ navigation, ...rest }) => {
  const currentId = rest;

  const user = auth.currentUser;
  const [name, onChangeName] = useState("");
  const [surname, onChangeSurname] = useState("");
  const [tel, onChangeTel] = useState("");
  const [selectedImage, setSelectedImage] = useState(user.photoURL);

  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        onChangeName(docSnap.data().name.firstName);
        onChangeSurname(docSnap.data().name.lastName);
        onChangeTel(docSnap.data().phone);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    })();
  }, []);

  const hanldeProfilePicture = async () => {
    const result = await pickImage();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      setError("Name is not valid");
      return;
    }
    if (!surname) {
      setError("Surname is not valid");
      return;
    }
    if (!tel || !tel.match(/^[0-9]+$/) || tel.length != 8) {
      setError("Telephone is not valid, must be 8 numbers, no spaces");
      return;
    }
    setError("");

    try {
      let photoURL = null;
      if (selectedImage) {
        const { url } = await uploadImage(
          selectedImage,
          "profile-pictures",
          user.uid
        );
        photoURL = url;
      }

      const updatedUserData = {
        name: {
          firstName: name,
          lastName: surname,
        },
        email: user.email,
        photoURL,
        phone: tel,
      };

      await updateProfile(user, {
        displayName: `${name} ${surname}`,
        photoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        ...updatedUserData,
        uid: user.uid,
      });

      alert("success");
      navigation.reset({
        index: 0,
        routes: [{ name: "Users" }],
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <View
      // eslint-disable-next-line no-undef
      style={styles.container}
    >
      <View style={styles.form}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              marginBottom: 20,
              borderRadius: 10,
              width: 120,
              height: 120,
            }}
            onPress={hanldeProfilePicture}
          >
            {!selectedImage ? (
              <MaterialCommunityIcons
                name="camera-plus"
                // color={colors.iconGray}
                size={45}
              />
            ) : (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={{ gap: 5 }}>
          <TextInput
            mode="outlined"
            label="Name"
            onChangeText={onChangeName}
            value={name}
          />
          <TextInput
            mode="outlined"
            label="Surname"
            value={surname}
            onChangeText={onChangeSurname}
          />
          <TextInput
            mode="outlined"
            label="Telephone"
            value={tel}
            onChangeText={onChangeTel}
          />
        </View>
        <View>
          <Text style={styles.error}>{error}</Text>
        </View>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
      </View>
    </View>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "80%",
  },
  title: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },

  button: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    textAlign: "right",
    color: "blue",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
  },
});
