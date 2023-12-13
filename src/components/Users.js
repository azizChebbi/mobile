import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../helpers";

export default function Users() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    const q = query(
      collection(db, "users"),
      where("email", "!=", user?.email || "chebbim106@gmail.com")
    );
    async function getUsers() {
      const querySnapshot = await getDocs(q);
      setContacts(querySnapshot.docs.map((doc) => doc.data()));
    }
    getUsers();
  }, []);

  const navigation = useNavigation();
  const renderContactItem = ({ item }) => {
    const onPress = () => {
      navigation.navigate("Chat", { item });
    };
    return (
      <TouchableOpacity style={styles.contactItem} onPress={onPress}>
        <Image source={{ uri: item.photoURL }} style={styles.contactImage} />
        <View style={styles.contactDetails}>
          <Text
            style={styles.contactName}
          >{`${item.name.firstName} ${item.name.lastName}`}</Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.email}
        renderItem={renderContactItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "700",
    fontSize: 30,
    color: colors.primary,
  },
  container: { marginVertical: 65, marginHorizontal: 30 },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 15,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 15,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactEmail: {
    color: "#666",
  },
  contactPhone: {
    color: "#666",
  },
});
