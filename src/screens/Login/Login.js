import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from "react-native";
import { Navigation } from "react-native-navigation";
import validate from "../../utility/validation";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

import logo from "../../assets/images/logo.png";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomButtonMultiColor from "../../components/CustomButtonMultiColor/CustomButtonMultiColor";

class LoginScreen extends Component {
  state = {
    activityDisplay: false,
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        }
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        }
      }
    }
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  storeLogin = async data => {
    let uid = JSON.parse(data._bodyText);
    fetch(
      "https://sepioguard-test-api.herokuapp.com/v1/salesperson/" + uid.id,
      {
        method: "GET",
        credentials: "include"
      }
    )
      .then(response => {
        console.log("Get User Data", response);
        if (response.status === 202) {
          let user = JSON.parse(response._bodyText);
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE login SET status = 'ok', uid = '" +
                user.id +
                "', email = '" +
                user.emailAddress +
                "', first_name = '" +
                user.firstName +
                "', last_name = '" +
                user.lastName +
                "', phone = '" +
                user.phone +
                "', employer = '" +
                user.employer.id +
                "' WHERE ID = 1",
              [],
              (tx, results) => {
                console.log("UPDATING STATUS", results);
                if (results.rowsAffected == 1) {
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      activityDisplay: false
                    };
                  });
                  this.goToScreen("PlanScreen");
                }
              }
            );
          });
        } else {
          console.log("Error recovering user data");
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
            "Login Error",
            "The Email or Password entered are incorrect.",
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
  };

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

  login = () => {
    console.log("Email -> " + this.state.controls.email.value);
    console.log("Password -> " + this.state.controls.password.value);

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

    if (
      !validate(
        this.state.controls.password.value,
        this.state.controls.password.validationRules
      )
    ) {
      errors.push(
        "- Password should have at least " +
          this.state.controls.password.validationRules.minLength +
          " characters."
      );
      console.log("Password InValid");
    } else {
      console.log("Password Valid");
    }

    console.log("Errors", errors);
    console.log("Errors Length", errors.length);

    if (errors.length > 0) {
      this.setState(prevState => {
        return {
          ...prevState,
          activityDisplay: false
        };
      });
      setTimeout(() => {
        Alert.alert(
          "Login Error",
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
      fetch("https://sepioguard-test-api.herokuapp.com/v1/auth/login", {
        method: "POST",
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          emailAddress: this.state.controls.email.value,
          password: this.state.controls.password.value
        })
      })
        .then(response => {
          console.log("Response Login", response);
          if (response.status == 200) {
            this.storeLogin(response);
          } else {
            this.setState(prevState => {
              return {
                ...prevState,
                activityDisplay: false
              };
            });
            setTimeout(() => {
              Alert.alert(
                "Login Error",
                "The Email or Password entered are incorrect.",
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
          console.log("Error Login", error);
          this.setState(prevState => {
            return {
              ...prevState,
              activityDisplay: false
            };
          });
          setTimeout(() => {
            Alert.alert(
              "Login Error",
              "The Email or Password entered are incorrect.",
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
        name: screenName,
        options: {
          topBar: {
            visible: false,
            height: 0
          }
        }
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
          <Text style={styles.text1}>Log In</Text>
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
          />
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            value={this.state.controls.password.value}
            onChangeText={password =>
              this.updateInputState("password", password)
            }
            autoCapitalize="none"
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
            onPressHandler={() => this.login()}
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
            onPressHandler={() => this.goToScreen("ForgotPasswordScreen")}
          />
        </View>
        <View style={styles.container2}>
          <CustomButtonMultiColor
            title="Don't have an account?"
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
