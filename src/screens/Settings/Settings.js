import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Footer
} from "native-base";
import { Navigation } from "react-native-navigation";

import CustomButton from "../../components/CustomButton/CustomButton";
import validate from "../../utility/validation";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import menu from "../../assets/images/menu.png";

class SettingsScreen extends Component {
  state = {
    menuState: false,
    activityDisplay: false,
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
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
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });

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

        db.transaction(
          tx => {
            tx.executeSql(
              "SELECT * FROM login WHERE ID = 1",
              [],
              (tx, results) => {
                console.log("RETRIEVING USER DATA", results.rows.item(0));
                this.updateInputState("email", results.rows.item(0).email);
                this.updateInputState(
                  "first_name",
                  results.rows.item(0).first_name
                );
                this.updateInputState(
                  "last_name",
                  results.rows.item(0).last_name
                );
                this.updateInputState("phone", results.rows.item(0).phone);
                this.setCompanyValue(results.rows.item(0).employer);
                setTimeout(() => {
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      activityDisplay: false
                    };
                  });
                }, 500);
              }
            );
          },
          err => {
            console.log("Error checking login existence", err);
          }
        );
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

  setCompanyValue(c) {
    this.setState(prevState => {
      return {
        ...prevState,
        company: c
      };
    });
  }

  goBack = () => {
    Navigation.pop(this.props.componentId);
  };

  openSideMenu = () => {
    if (this.state.menuState == false) {
      this.setState({ menuState: true });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    } else if (this.state.menuState == true) {
      this.setState({ menuState: false });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      });
    }
  };

  saveProfile = () => {
    console.log("Email -> " + this.state.controls.email.value);
    console.log("First Name -> " + this.state.controls.first_name.value);
    console.log("Last Name -> " + this.state.controls.last_name.value);
    console.log("Phone -> " + this.state.controls.phone.value);
    console.log("Company -> " + this.state.company);

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
        "- Your Phone Number should have at least " +
          this.state.controls.phone.validationRules.minLength +
          " characters."
      );
    }

    if (!this.state.company) {
      errors.push("- Please select your company.");
    }

    console.log("Errors -> " + errors.length);

    if (errors.length > 0) {
      this.setState(prevState => {
        return {
          ...prevState,
          activityDisplay: false
        };
      });
      setTimeout(() => {
        Alert.alert(
          "Information Error",
          errors.join("\n"),
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
    } else {
      console.log("Processing Profile Data");

      fetch(
        "https://sepioguard-test-api.herokuapp.com/v1/auth/update-profile",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            emailAddress: this.state.controls.email.value,
            firstName: this.state.controls.first_name.value,
            lastName: this.state.controls.last_name.value,
            phone: this.state.controls.phone.value
          })
        }
      )
        .then(response => {
          console.log("Profile Update Result", response);

          db.transaction(tx => {
            tx.executeSql(
              "UPDATE login SET first_name = '" +
                this.state.controls.first_name.value +
                "', last_name = '" +
                this.state.controls.last_name.value +
                "', phone = '" +
                this.state.controls.phone.value +
                "', employer = '" +
                this.state.company +
                "' WHERE ID = 1",
              [],
              (tx, results) => {
                console.log("UPDATING PROFILE INFORMATION", results);
                if (results.rowsAffected == 1) {
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      activityDisplay: false
                    };
                  });
                  setTimeout(() => {
                    Alert.alert(
                      "Save Profile",
                      "Profile Saved!",
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
                  }, 500);
                }
              }
            );
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
  };

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
        <Header
          style={{
            backgroundColor: "white",
            borderBottomWidth: 0,
            elevation: 0
          }}
        >
          <Left>
            <Button transparent onPress={() => this.openSideMenu()}>
              <Image source={menu} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "white" }}>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.header}>
            <Text style={styles.text1}>Settings</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={email => this.updateInputState("email", email)}
              value={this.state.controls.email.value}
              placeholder="Email Address"
              placeholderTextColor="#0F195B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={false}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.containerColStart}>
              <TextInput
                style={styles.firstnameInput}
                onChangeText={first_name =>
                  this.updateInputState("first_name", first_name)
                }
                value={this.state.controls.first_name.value}
                placeholder="First Name"
                placeholderTextColor="#0F195B"
                autoCorrect={false}
              />
            </View>
            <View style={styles.containerColEnd}>
              <TextInput
                style={styles.lastnameInput}
                onChangeText={last_name =>
                  this.updateInputState("last_name", last_name)
                }
                value={this.state.controls.last_name.value}
                placeholder="Last Name"
                placeholderTextColor="#0F195B"
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={phone => this.updateInputState("phone", phone)}
              value={this.state.controls.phone.value}
              placeholder="Phone Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
              autoCorrect={false}
            />
          </View>
          <View style={styles.nextBt}>
            <CustomButton
              title="SAVE"
              width="95%"
              bgColor="#F3407B"
              paddingTop={14}
              paddingRight={10}
              paddingBottom={14}
              paddingLeft={10}
              textAlign="center"
              color="#FFFFFF"
              fontWeight="bold"
              borderWith={1}
              borderColor="#F3407B"
              fontFamily="Avenir"
              fontSize={16}
              borderRadius={5}
              marginTop={15}
              onPressHandler={() => this.saveProfile()}
            />
          </View>
          <View style={styles.back}>
            <CustomButton
              title=""
              width="90%"
              bgColor="#FFFFFF"
              paddingTop={14}
              paddingRight={10}
              paddingBottom={14}
              paddingLeft={10}
              textAlign="center"
              color="#FFFFFF"
              fontWeight="bold"
              borderWidth={1}
              borderColor="#FFFFFF"
              fontFamily="Avenir"
              fontSize={16}
              borderRadius={5}
              onPressHandler={() => console.log("Dummy")}
            />
          </View>
        </Content>
        <Footer
          style={{
            backgroundColor: "rgba(0,0,0,0);",
            borderTopWidth: 0
          }}
        >
          <Text style={styles.textPlan}>
            Powered by <Text style={styles.pink}>Sepio Guard</Text>
          </Text>
        </Footer>
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
  topHeader: {
    marginTop: 30,
    height: 50,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginLeft: 40
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-end",
    //backgroundColor: "red",
    flexDirection: "row",
    width: "100%",
    flex: 1
  },
  row: {
    width: "95%",
    height: 50,
    //backgroundColor: "green",
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
  },
  emailInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  firstnameInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "96%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  lastnameInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "96%",
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#efefef"
  },
  dobText: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  dob: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
    width: "94%"
  },
  back: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 2
  },
  nextBt: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  powered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%"
  },
  steps: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  },
  pink: {
    color: "#F3407B",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  textPlan: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
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
    color: "#01396F",
    marginTop: 5
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
    color: "#01396F",
    marginTop: 5
  }
});

export default SettingsScreen;
