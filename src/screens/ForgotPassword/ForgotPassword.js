import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
//import { connect } from 'react-redux';
//import { addPlace } from '../../store/actions/index';
import validate from "../../utility/validation";

import logo from "../../assets/images/logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";

class ForgotPasswordScreen extends Component {
  state = {
    activityDisplay: false,
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        }
      }
    }
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  updateInputState = (key, value) => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          [key]: {
            ...prevState.controls[key],
            value: value
          }
        }
      };
    });
  };

  getPassword = () => {
    console.log("Email -> " + this.state.controls.email.value);

    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });

    let errors = [];

    if (
      !validate(
        this.state.controls.email.value,
        this.state.controls.email.validationRules
      )
    ) {
      console.log("Email inValid");
      errors.push("- Invalid Email.");
    } else {
      console.log("Email Valid");
    }

    if (errors.length > 0) {
      this.setState(prevState => {
        return {
          ...prevState,
          activityDisplay: false
        };
      });
      setTimeout(() => {
        Alert.alert(
          "Password Recover Error",
          errors.join("\n"),
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
                this.updateInputState("email", "");
                this.updateInputState("password", "");
                this.emailInput.focus();
              }
            }
          ],
          { cancelable: false }
        );
      }, 200);
    } else {
      fetch(
        "https://sepioguard-test-api.herokuapp.com/v1/auth/send-password-recovery-email",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            emailAddress: this.state.controls.email.value
          })
        }
      )
        .then(response => {
          console.log("Response Recover Password", response);
          if (response.status == 200) {
            Alert.alert(
              "Password Recovery",
              "Instructions on how to recover your password has been sent to the entered Email.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("OK Pressed");
                    this.updateInputState("email", "");
                    this.emailInput.focus();
                  }
                }
              ],
              { cancelable: false }
            );
          } else {
            this.setState(prevState => {
              return {
                ...prevState,
                activityDisplay: false
              };
            });
            setTimeout(() => {
              Alert.alert(
                "Password Recovery Error",
                "The Email entered does not exist.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("OK Pressed");
                      this.updateInputState("email", "");
                      this.updateInputState("password", "");
                      this.emailInput.focus();
                    }
                  }
                ],
                { cancelable: false }
              );
            }, 200);
          }
        })
        .catch(error => {
          console.log("Error Login", error._bodyText);
          this.setState(prevState => {
            return {
              ...prevState,
              activityDisplay: false
            };
          });
          setTimeout(() => {
            Alert.alert(
              "Password Recovery Error",
              "The Email entered does not exist.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("OK Pressed");
                    this.updateInputState("email", "");
                    this.updateInputState("password", "");
                    this.emailInput.focus();
                  }
                }
              ],
              { cancelable: false }
            );
          }, 200);
        });
    }
  };

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
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activityDisplay}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#F3407B" />
          </View>
        </Modal>

        <View style={styles.container1}>
          <Image source={logo} />
          <Text style={styles.text1}>Recover Password</Text>
          <TextInput
            placeholder="Email Address"
            style={styles.emailInput}
            value={this.state.controls.email.value}
            onChangeText={email => this.updateInputState("email", email)}
            ref={input => {
              this.emailInput = input;
            }}
            autoCapitalize="none"
            placeholderTextColor="#0F195B"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <CustomButton
            title="RECOVER PASSWORD"
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
            onPressHandler={() => this.getPassword()}
          />
          <CustomButton
            title="BACK"
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
            onPressHandler={() => this.goBack()}
          />
        </View>
        <View style={styles.container2} />
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

export default ForgotPasswordScreen;
