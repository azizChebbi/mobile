/* eslint-disable react/prop-types */
import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import validator from "validator";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    if (!validator.isEmail(email)) {
      setError("Email is not valid");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const currentId = auth.currentUser.uid;
        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
      });

    // navigation.navigate("home");
  };

  return (
    <View
      // eslint-disable-next-line no-undef
      // source={require("../../assets/bg.webp")}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <View>
          <TextInput
            mode="outlined"
            label="Email"
            onChangeText={onChangeEmail}
            value={email}
          />
          <TextInput
            mode="outlined"
            label={"Password"}
            secureTextEntry
            right={<TextInput.Icon icon="eye" />}
            value={password}
            onChangeText={onChangePassword}
          />
        </View>
        <View>{error && <Text style={styles.error}>{error}</Text>}</View>
        <View style={styles.buttons}>
          {/* <Pressable onPress={handleSubmit} style={styles.button}>
            <Text>Submit</Text>
          </Pressable> */}
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
          {/* <Button title="Submit" />
          <Button title="Cancel" /> */}
        </View>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Create new user</Text>
        </Pressable>
      </View>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

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
    color: "gray",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    borderRadius: 5,
    paddingVertical: 5,
  },
  buttons: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  link: {
    textAlign: "right",
    color: "#6B4FAA",
    textDecorationLine: "underline",
    fontWeight: "700",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    fontWeight: "600",
  },
});
