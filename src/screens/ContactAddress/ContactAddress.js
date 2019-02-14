import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
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
  Text
} from "native-base";
import { Navigation } from "react-native-navigation";
import RNPickerSelect from "react-native-picker-select";
import validate from "../../utility/validation";

import CustomButton from "../../components/CustomButton/CustomButton";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import menu from "../../assets/images/menu.png";

class ContactAddressScreen extends Component {
  state = {
    menuState: false,
    address2: "",
    activityDisplay: false,
    selected_state: null,
    selected_plan: 0,
    controls: {
      address: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      city: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      zip: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 5
        }
      }
    },
    items: [
      {
        label: "AL",
        value: "AL"
      },
      {
        label: "AK",
        value: "AK"
      },
      {
        label: "AZ",
        value: "AZ"
      },
      {
        label: "AR",
        value: "AR"
      },
      {
        label: "CA",
        value: "CA"
      },
      {
        label: "CO",
        value: "CO"
      },
      {
        label: "CT",
        value: "CT"
      },
      {
        label: "DE",
        value: "DE"
      },
      {
        label: "FL",
        value: "FL"
      },
      {
        label: "GA",
        value: "GA"
      },
      {
        label: "HI",
        value: "HI"
      },
      {
        label: "ID",
        value: "ID"
      },
      {
        label: "IL",
        value: "IL"
      },
      {
        label: "IN",
        value: "IN"
      },
      {
        label: "AZ",
        value: "AZ"
      },
      {
        label: "IA",
        value: "IA"
      },
      {
        label: "KS",
        value: "KS"
      },
      {
        label: "KY",
        value: "KY"
      },
      {
        label: "LA",
        value: "LA"
      },
      {
        label: "MD",
        value: "MD"
      },
      {
        label: "ME",
        value: "ME"
      },
      {
        label: "MD",
        value: "MD"
      },
      {
        label: "MA",
        value: "MA"
      },
      {
        label: "MI",
        value: "MI"
      },
      {
        label: "MN",
        value: "MN"
      },
      {
        label: "MS",
        value: "MS"
      },
      {
        label: "MO",
        value: "MO"
      },
      {
        label: "MT",
        value: "MT"
      },
      {
        label: "NE",
        value: "NE"
      },
      {
        label: "NV",
        value: "NV"
      },
      {
        label: "NH",
        value: "NH"
      },
      {
        label: "NJ",
        value: "NJ"
      },
      {
        label: "NM",
        value: "NM"
      },
      {
        label: "NY",
        value: "NY"
      },
      {
        label: "NC",
        value: "NC"
      },
      {
        label: "ND",
        value: "ND"
      },
      {
        label: "OH",
        value: "OH"
      },
      {
        label: "OK",
        value: "OK"
      },
      {
        label: "OR",
        value: "OR"
      },
      {
        label: "PA",
        value: "PA"
      },
      {
        label: "RI",
        value: "RI"
      },
      {
        label: "SC",
        value: "SC"
      },
      {
        label: "SD",
        value: "SD"
      },
      {
        label: "TN",
        value: "TN"
      },
      {
        label: "TX",
        value: "TX"
      },
      {
        label: "UT",
        value: "UT"
      },
      {
        label: "VT",
        value: "VT"
      },
      {
        label: "VA",
        value: "VA"
      },
      {
        label: "WA",
        value: "WA"
      },
      {
        label: "WV",
        value: "WV"
      },
      {
        label: "WI",
        value: "WI"
      },
      {
        label: "WY",
        value: "WY"
      }
    ]
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT selected_plan FROM plan WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Selected Plan -> " + results.rows.item(0).selected_plan);
          this.setState(prevState => {
            return {
              ...prevState,
              selected_plan: results.rows.item(0).selected_plan
            };
          });
        }
      );
    });
  }

  saveContactAddress = () => {
    console.log("Address -> " + this.state.controls.address.value);
    console.log("Address 2 -> " + this.state.address2);
    console.log("City -> " + this.state.controls.city.value);
    console.log("ZIP -> " + this.state.controls.zip.value);

    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });

    let errors = [];

    if (
      !validate(
        this.state.controls.address.value,
        this.state.controls.address.validationRules
      )
    ) {
      errors.push("- Invalid Address.");
    }

    if (
      !validate(
        this.state.controls.city.value,
        this.state.controls.city.validationRules
      )
    ) {
      errors.push("- Invalid City.");
    }

    if (!this.state.selected_state) {
      errors.push("- Invalid State.");
    }

    if (
      !validate(
        this.state.controls.zip.value,
        this.state.controls.zip.validationRules
      )
    ) {
      errors.push("- Invalid ZIP Code.");
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
          "Contact Address Error",
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
      let contact_address = {
        address: this.state.controls.address.value,
        address2: this.state.address2,
        city: this.state.controls.city.value,
        zip: this.state.controls.zip.value,
        selected_state: this.state.selected_state
      };
      contact_address = JSON.stringify(contact_address);
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE plan SET contact_address = '" +
            contact_address +
            "' WHERE ID = 1",
          [],
          (tx, results) => {
            console.log("UPDATING CONTACT ADDRESS", results);
            if (results.rowsAffected == 1) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  activityDisplay: false
                };
              });
              setTimeout(() => {
                console.log("Selected Plan -> " + this.state.selected_plan);
                if (this.state.selected_plan == 2) {
                  this.goToScreen("PartnerInformationScreen");
                } else {
                  this.goToScreen("BillingInformationScreen");
                }
              }, 500);
            }
          }
        );
      });
    }
  };

  updateInputState = (key, value) => {
    this.setState(prevState => {
      return {
        ...prevState,
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

  updateAddress2(a) {
    this.setState(prevState => {
      return {
        ...prevState,
        address2: a
      };
    });
  }

  navigationButtonPressed({ buttonId }) {
    console.log("Button ID -> " + buttonId);
    if (buttonId == "Drawer" && this.state.menuState == false) {
      this.setState({ menuState: true });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    } else if (buttonId == "Drawer" && this.state.menuState == true) {
      this.setState({ menuState: false });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      });
    }
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

  setStateValue = s => {
    this.setState(prevState => {
      return {
        ...prevState,
        selected_state: s
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
            <Text style={styles.text1}>Contact Address</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={address =>
                this.updateInputState("address", address)
              }
              placeholder="Street Address"
              placeholderTextColor="#0F195B"
              keyboardType="default"
              autoCorrect={false}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={address2 => this.updateAddress2(address2)}
              placeholder="Apartment, suite, unit, building, etc"
              placeholderTextColor="#0F195B"
              keyboardType="default"
              autoCorrect={false}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.containerColStart}>
              <TextInput
                style={styles.firstnameInput}
                onChangeText={city => this.updateInputState("city", city)}
                placeholder="City"
                placeholderTextColor="#0F195B"
                autoCorrect={false}
              />
            </View>
            <View style={styles.containerColEnd}>
              <RNPickerSelect
                placeholder={{
                  label: "Select State...",
                  value: null,
                  color: "#01396F"
                }}
                items={this.state.items}
                hideIcon={true}
                onValueChange={value => {
                  this.setStateValue(value);
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
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={zip => this.updateInputState("zip", zip)}
              placeholder="ZIP Code"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
              autoCorrect={false}
            />
          </View>
          <View style={styles.nextBt}>
            <CustomButton
              title="NEXT"
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
              onPressHandler={() => {
                this.saveContactAddress();
              }}
            />
          </View>
          <View style={styles.back}>
            <Text style={styles.steps}>2 of 4</Text>
            <CustomButton
              title="BACK"
              width="90%"
              bgColor="#FFFFFF"
              paddingTop={14}
              paddingRight={10}
              paddingBottom={14}
              paddingLeft={10}
              textAlign="center"
              color="#01396F"
              fontWeight="bold"
              borderWidth={1}
              borderColor="#01396F"
              fontFamily="Avenir"
              fontSize={16}
              borderRadius={5}
              onPressHandler={() => this.goBack()}
            />
          </View>
          <View style={styles.powered}>
            <Text style={styles.textPlan}>
              Powered by <Text style={styles.pink}>Sepio Guard</Text>
            </Text>
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
    flexDirection: "row",
    marginLeft: "2.5%"
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
    width: "94%",
    marginLeft: "3%"
  },
  back: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 2.2
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
    color: "#01396F"
  },
  inputAndroid: {
    fontSize: 16,
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F",
    height: 40
  }
});

export default ContactAddressScreen;
