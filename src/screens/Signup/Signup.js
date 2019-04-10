import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { Container, Content, Text } from "native-base";
import { Navigation } from "react-native-navigation";
import validate from "../../utility/validation";
import RNPickerSelect from "react-native-picker-select";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

import CustomButton from "../../components/CustomButton/CustomButton";

class SignupScreen extends Component {
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
      },
      first_name: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      last_name: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      phone: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 10
        }
      }
    },
    company: 0,
    items: [
      {
        value: "0",
        label: "--"
      }
    ]
  };

  constructor(props) {
    super(props);
    this.inputRefs = {};
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    fetch("https://sepioguard-test-api.herokuapp.com/v1/company", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        console.log("Response Companies", response);
        let companies = JSON.parse(response._bodyText);
        let c = {};
        for (var k in companies) {
          companies[k]["value"] = companies[k]["id"];
          companies[k]["label"] = companies[k]["name"];
        }

        this.setState(prevState => {
          return {
            ...prevState,
            items: companies
          };
        });
      })
      .catch(error => {
        setTimeout(() => {
          Alert.alert(
            "Error",
            "The App failed to load the Companies List.",
            [
              {
                text: "OK",
                onPress: () => {
                  console.log("OK Pressed");
                }
              }
            ],
            { cancelable: false }
          );
        }, 200);
      });
  }

  setCompanyValue(c) {
    this.setState(prevState => {
      return {
        ...prevState,
        company: c
      };
    });
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

  storeLogin = async () => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE login SET status = 'ok' WHERE ID = 1",
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
  };

  signUp = () => {
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
      errors.push("- Invalid Email.");
    }

    if (
      !validate(
        this.state.controls.first_name.value,
        this.state.controls.first_name.validationRules
      )
    ) {
      errors.push(
        "- Your First Name should have at least " +
          this.state.controls.first_name.validationRules.minLength +
          " characters."
      );
    }

    if (
      !validate(
        this.state.controls.last_name.value,
        this.state.controls.last_name.validationRules
      )
    ) {
      errors.push(
        "- Your Last Name should have at least " +
          this.state.controls.last_name.validationRules.minLength +
          " characters."
      );
    }

    if (
      !validate(
        this.state.controls.phone.value,
        this.state.controls.phone.validationRules
      )
    ) {
      errors.push(
        "- Your Phone should have at least " +
          this.state.controls.phone.validationRules.minLength +
          " numbers."
      );
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
    }

    if (this.state.company == 0) {
      errors.push("- You must select your company.");
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
          "Login Error",
          errors.join("\n"),
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
                this.updateInputState("password", "");
                this.emailInput.focus();
              }
            }
          ],
          { cancelable: false }
        );
      }, 200);
    } else {
      fetch("https://sepioguard-test-api.herokuapp.com/v1/auth/signup", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          emailAddress: this.state.controls.email.value,
          password: this.state.controls.password.value,
          firstName: this.state.controls.first_name.value,
          lastName: this.state.controls.last_name.value,
          phone: this.state.controls.phone.value,
          employer: this.state.company
        })
      })
        .then(response => {
          console.log("Response Sign Up", response);
          if (response.status == 200) {
            this.setState(prevState => {
              return {
                ...prevState,
                activityDisplay: false
              };
            });
            this.storeLogin();
          } else {
            this.setState(prevState => {
              return {
                ...prevState,
                activityDisplay: false
              };
            });
            setTimeout(() => {
              Alert.alert(
                "Signup Error",
                "The Email entered already exists. Please Log In.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("OK Pressed");
                    }
                  }
                ],
                { cancelable: false }
              );
            }, 200);
          }
        })
        .catch(error => {
          console.log("Error Signup", error._bodyText);
          this.setState(prevState => {
            return {
              ...prevState,
              activityDisplay: false
            };
          });
          setTimeout(() => {
            Alert.alert(
              "Sign Up Error",
              "The Email entered already exists. Please Log In.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("OK Pressed");
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
      <Container>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activityDisplay}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#F3407B" />
          </View>
        </Modal>
        <Content>
          <View style={styles.container1}>
            <Text style={styles.text1}>Sign Up</Text>
            <TextInput
              style={styles.emailInput}
              onChangeText={val => this.updateInputState("email", val)}
              placeholder="Email Address"
              placeholderTextColor="#0F195B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.row}>
              <View style={styles.containerColStart}>
                <TextInput
                  style={styles.firstnameInput}
                  onChangeText={val => this.updateInputState("first_name", val)}
                  placeholder="First Name"
                  placeholderTextColor="#0F195B"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.containerColEnd}>
                <TextInput
                  style={styles.lastnameInput}
                  onChangeText={val => this.updateInputState("last_name", val)}
                  placeholder="Last Name"
                  placeholderTextColor="#0F195B"
                  autoCorrect={false}
                />
              </View>
            </View>
            <TextInput
              style={styles.passwordInput}
              onChangeText={val => this.updateInputState("phone", val)}
              placeholder="Phone Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
              autoCorrect={false}
            />
            <TextInput
              style={styles.passwordInput}
              onChangeText={val => this.updateInputState("password", val)}
              placeholder="Password"
              placeholderTextColor="#0F195B"
              autoCorrect={false}
              secureTextEntry
            />
            <View style={[styles.row, styles.rowSelect]}>
              <RNPickerSelect
                placeholder={{
                  label: "Select your company...",
                  value: null,
                  color: "#01396F"
                }}
                items={this.state.items}
                hideIcon={true}
                onValueChange={value => {
                  this.setCompanyValue(value);
                }}
                onUpArrow={() => {
                  this.inputRefs.name.focus();
                }}
                onDownArrow={() => {
                  this.inputRefs.picker2.togglePicker();
                }}
                style={{ ...pickerSelectStyles }}
                value={this.state.favColor}
                ref={el => {
                  this.inputRefs.picker = el;
                }}
              />
            </View>

            <CustomButton
              title="SIGN UP"
              width="90%"
              bgColor="#F3407B"
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
              color="#FFFFFF"
              fontWeight="bold"
              borderWith={1}
              borderColor="#F3407B"
              fontFamily="Avenir"
              fontSize={16}
              onPressHandler={() => this.signUp()}
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
              borderColor="#000000"
              fontFamily="Avenir"
              fontSize={16}
              onPressHandler={() => this.goBack()}
            />
          </View>
        </Content>
      </Container>
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
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
    width: "100%"
  },
  container2: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "green",
    width: "100%"
  },
  containerMultiple: {
    flex: 0.26,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "green",
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
  rowSelect: {
    marginTop: 10,
    marginBottom: 10
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F"
  },
  inputAndroid: {
    fontSize: 16,
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    height: 40,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F"
  }
});

export default SignupScreen;
