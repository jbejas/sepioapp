import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
//import { connect } from 'react-redux';
//import { addPlace } from '../../store/actions/index';

import logo from "../../assets/images/logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomButtonMultiColor from "../../components/CustomButtonMultiColor/CustomButtonMultiColor";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    /*Navigation.mergeOptions(this.props.componentId, {
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
    });*/
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
          <Text style={styles.text1}>Log In</Text>
          <TextInput
            style={styles.emailInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Email Address"
            placeholderTextColor="#0F195B"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.passwordInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Password"
            placeholderTextColor="#0F195B"
            secureTextEntry
          />
          <CustomButton
            title="LOG IN"
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
            onPressHandler={() => this.goToScreen("PlanScreen")}
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
            onPressHandler={() => this.goToScreen("PlanScreen")}
          />
        </View>
        <View style={styles.container2}>
          <CustomButtonMultiColor
            title="Already have an account?"
            secondTitle=" Sign In"
            width="90%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginTop={0}
            marginRight={0}
            marginBottom={0}
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
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
    width: "100%"
  },
  container2: {
    flex: 1,
    //backgroundColor: "green",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20
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
  }
});

export default LoginScreen;
