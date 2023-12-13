import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import {
  ActivityIndicator,
  MD2Colors,
  Modal,
  Portal,
  Button,
  PaperProvider,
} from "react-native-paper";
import ImagePicker, { launchImageLibrary } from "react-native-image-picker";
import { ref, onValue, getDatabase, onChildAdded } from "firebase/database";
import {
  formatTimestamp,
  getChatID,
  pickImage,
  sendMessage,
  uploadImage,
} from "../helpers";
import { auth } from "../../firebase/config";
import Message from "../components/Message";
import { Appbar } from "react-native-paper";
import { colors } from "../helpers/index";
import ChatImages from "../components/ChatImages";
// const user = auth.currentUser;
// const sender = user?.email;

const ChatScreen = () => {
  // ===============================================
  // ================= STATE====================
  // ===============================================
  const route = useRoute();
  const {
    name: { firstName, lastName },
    email: receiver,
    photoURL,
  } = route.params.item;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // ===============================================
  // ================= EFFECTS ====================
  // ===============================================
  // useEffect(() => {
  //   const starCountRef = ref(db, "messages/" + getChatID(sender, receiver));
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log("data: ", data);
  //     // updateStarCount(postElement, data);
  //   });
  // }, []);

  useEffect(() => {
    const user = auth.currentUser;
    const sender = user?.email;
    console.log(sender, receiver);
    const db = getDatabase();
    const messagesRef = ref(db, `/messages/${getChatID(sender, receiver)}`);

    onValue(messagesRef, (snapshot) => {
      const msgs = [];
      snapshot.forEach((childSnapshot) => {
        msgs.push({ ...childSnapshot.val(), key: childSnapshot.key });
      });

      setMessages([...msgs]);
    });
  }, []);

  // ===============================================
  // ================= HANDLERS ====================
  // ===============================================

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const sender = auth.currentUser.email;
    sendMessage(sender, receiver, messageInput, "text");
    setMessageInput("");
  };

  const handleAttachment = () => {
    ImagePicker.showImagePicker(
      {
        title: "Select Image",
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, image: response.uri, type: "image" },
          ]);
        }
      }
    );
  };

  const hanldeImageUpload = async () => {
    const user = auth.currentUser;
    const sender = user.email;

    try {
      const result = await pickImage();
      if (!result.canceled) {
        let selectedImage = result.assets[0].uri;
        setLoading(true);
        const { url } = await uploadImage(
          selectedImage,
          "chat-images",
          user.uid
        );
        sendMessage(sender, receiver, url, "image");
        console.log(url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // ================= RENDERED UI =================
  // ===============================================

  const renderMessageItem = ({ item }) => {
    return <Message messageObj={item} />;
  };
  const containerStyle = {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingBottom: 20,
  };

  const sender = auth.currentUser.email;

  return (
    <PaperProvider style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator animating={true} color={MD2Colors.white} />
        </View>
      )}
      <Appbar.Header
        style={{ borderBottomWidth: 1, borderColor: colors.border }}
      >
        <Image source={{ uri: photoURL }} style={styles.contactImage} />
        <Appbar.Content title={firstName + " " + lastName} />
        <Appbar.Action icon="image" onPress={showModal} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>{firstName + " " + lastName}</Text>
      </View> */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, i) => item.key}
        style={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={hanldeImageUpload}>
          <Icon name="attach-file" type="material" color="#3498db" size={30} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageInput}
          onChangeText={(text) => setMessageInput(text)}
        />
        <TouchableOpacity onPress={handleSend}>
          <Icon name="send" type="material" color="#3498db" size={30} />
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text
            style={{ fontSize: 35, textAlign: "right" }}
            onPress={hideModal}
          >
            x
          </Text>
          <ChatImages sender={sender} receiver={receiver} />
          {/* <Text>Example Modal. Click outside this area to dismiss.</Text> */}
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: "#3498db",
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  contactImage: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 20,
    paddingHorizontal: 15,
    padding: 10,
    marginHorizontal: 10,
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

export default ChatScreen;
