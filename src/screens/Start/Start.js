import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";

import logo from "../../assets/images/logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";

class StartScreen extends Component {
  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Image source={logo} />
        </View>
        <View style={styles.container2}>
          <Text style={styles.text1}>Welcome to</Text>
          <Text style={styles.text2}>Sepio Guard</Text>
          <Text style={styles.text3}>Away From Home Insurance</Text>
        </View>
        <View style={styles.container3}>
          <CustomButton
            title="LOGIN"
            width="50%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            borderRadius={0}
            textAlign="center"
            color="#0F195B"
            fontWeight="bold"
            borderWith={1}
            borderColor="#FFFFFF"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("LoginScreen")}
          />
          <CustomButton
            title="SIGN UP"
            width="50%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            borderRadius={0}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("SignupScreen")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01396F",
    flexDirection: "column"
  },
  container1: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
    width: "100%"
  },
  container2: {
    flex: 3,
    alignItems: "center",
    //backgroundColor: "green",
    width: "100%"
  },
  container3: {
    flex: 6,
    justifyContent: "space-between",
    alignItems: "flex-end",
    //backgroundColor: "black",
    width: "100%",
    flexDirection: "row"
  },
  text1: {
    color: "#FFF",
    fontSize: 26,
    fontFamily: "Avenir",
    fontWeight: "bold"
  },
  text2: {
    color: "#FFF",
    fontSize: 30,
    fontFamily: "Avenir",
    fontWeight: "bold",
    paddingTop: 7
  },
  text3: {
    color: "#FFF",
    fontFamily: "Avenir",
    fontWeight: "200",
    fontSize: 16,
    paddingTop: 10
  }
});

export default StartScreen;
