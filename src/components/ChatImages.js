/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import { ref, onValue, getDatabase, onChildAdded } from "firebase/database";
import { getChatID } from "../helpers";

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function ChatImages({ sender, receiver }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, `/messages/${getChatID(sender, receiver)}`);

    onValue(messagesRef, (snapshot) => {
      let msgs = [];
      snapshot.forEach((childSnapshot) => {
        msgs.push({ ...childSnapshot.val(), key: childSnapshot.key });
      });
      msgs = msgs
        .filter((msg) => msg.type == "image")
        .map((msg) => msg.message);
      console.log("msgs: ", msgs);
      setImages([...msgs]);
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.source} style={styles.image} />
    </View>
  );
  return (
    <View style={styles.container}>
      {images.map((img, i) => (
        <Image style={styles.image} key={i} source={{ uri: img }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  image: {
    width: 110, // Adjust the width based on the number of columns
    height: 100, // Set a fixed height or use a dynamic calculation based on your needs
    resizeMode: "cover",
    borderRadius: 8,
  },
});
