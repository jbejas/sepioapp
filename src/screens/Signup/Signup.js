import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";

import logo from "../../assets/images/logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomButtonMultiColor from "../../components/CustomButtonMultiColor/CustomButtonMultiColor";

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        visible: true,
        hideOnScroll: false,
        background: {
          color: "#FFFFFF"
        },
        noBorder: true,
        backButton: {
          color: "#FFF"
        }
      }
    });
  }

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  goBack = () => {
    Navigation.pop(this.props.componentId);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Image source={logo} />
          <Text style={styles.text1}>Sign Up</Text>
          <TextInput
            style={styles.emailInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Email Address"
            placeholderTextColor="#0F195B"
            keyboardType="email-address"
          />
          <View style={styles.row}>
            <View style={styles.containerColStart}>
              <TextInput
                style={styles.firstnameInput}
                onChangeText={text => this.setState({ text })}
                placeholder="First Name"
                placeholderTextColor="#0F195B"
              />
            </View>
            <View style={styles.containerColEnd}>
              <TextInput
                style={styles.lastnameInput}
                onChangeText={text => this.setState({ text })}
                placeholder="Last Name"
                placeholderTextColor="#0F195B"
              />
            </View>
          </View>
          <TextInput
            style={styles.passwordInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Phone Number"
            placeholderTextColor="#0F195B"
            secureTextEntry
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.passwordInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Password"
            placeholderTextColor="#0F195B"
            secureTextEntry
          />
          <CustomButton
            title="SIGN UP"
            width="90%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginTop={10}
            marginRight={0}
            marginBottom={14}
            marginLeft={0}
            borderRadius={5}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("SignupScreen")}
          />
          <CustomButton
            title="Forgot Password?"
            width="90%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginTop={0}
            marginRight={0}
            marginBottom={14}
            marginLeft={0}
            borderRadius={5}
            textAlign="center"
            color="#F3407B"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("SignupScreen")}
          />
        </View>
        <View style={styles.container2}>
          <CustomButtonMultiColor
            title="Already have an account?"
            secondTitle=" Log In"
            width="90%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginTop={0}
            marginRight={0}
            marginBottom={14}
            marginLeft={0}
            borderRadius={5}
            textAlign="center"
            color="#0F195B"
            secondColor="#F3407B"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goBack()}
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
    backgroundColor: "#FFF",
    flexDirection: "column"
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'red',
    width: "100%"
  },
  container2: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'green',
    width: "100%"
  },
  containerMultiple: {
    flex: 0.36,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: 'green',
    width: "93%"
  },
  containerCol: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    //backgroundColor: 'green'
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  emailInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "90%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    marginTop: 15,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  passwordInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "90%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  firstnameInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "92%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  lastnameInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "92%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  row: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  containerCol: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerColStart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  containerColEnd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
  }
});

export default SignupScreen;
