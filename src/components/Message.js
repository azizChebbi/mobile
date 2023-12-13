import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import { auth } from "../../firebase/config";
import { formatTimestamp } from "../helpers";

/* eslint-disable react/prop-types */
const Message = ({ messageObj }) => {
  const { type, message, sender, receiver, timestamp } = messageObj;
  const user = auth.currentUser;
  const isUserSender = sender === user?.email;
  return (
    <View
      style={[
        styles.messageContainer,
        isUserSender ? styles.userMessage : styles.receiverMessage,
      ]}
    >
      {type === "text" ? (
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{message}</Text>
          {/* <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text> */}
        </View>
      ) : (
        <Image source={{ uri: message }} style={styles.imageMessage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: "#3498db",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userMessage: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  textMessageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  messageBubble: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  messageText: {
    color: "white",
  },
  timestamp: {
    color: "gray",
    fontSize: 12,
    marginTop: 5,
  },
  imageMessageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default Message;
