/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  BackHandler,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import validator from "validator";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] = React.useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!validator.isEmail(email)) {
      setError("Email is not valid");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password != confirmPassword) {
      setError("Passwords are not the same");
      return;
    }
    setError("");
    const response = createUserWithEmailAndPassword(auth, email, password);
    response
      .then((res) => {
        console.log(res);

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((err) => {
        console.log(err.toString().split(":"));
        alert(err.toString().split(":")[2]);
      });
    // navigation.navigate("home");
  };
  const [count, setCont] = useState(5);
  return (
    <View
      // eslint-disable-next-line no-undef
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Register</Text>
        {/* ======== ERRORS ============== */}

        <View>
          {/* <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
          /> */}
          <TextInput
            mode="outlined"
            label="Email"
            onChangeText={onChangeEmail}
            value={email}
          />

          {/* <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
          /> */}
          <TextInput
            mode="outlined"
            label={"Password"}
            secureTextEntry
            right={<TextInput.Icon icon="eye" />}
            value={password}
            onChangeText={onChangePassword}
          />

          {/* <TextInput
            placeholder="Confirm password"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
          /> */}

          <TextInput
            mode="outlined"
            label={"Confirm password"}
            secureTextEntry
            right={<TextInput.Icon icon="eye" />}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
          />
        </View>
        <View>{error && <Text style={styles.error}>{error}</Text>}</View>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Login</Text>
        </Pressable>
      </View>
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
