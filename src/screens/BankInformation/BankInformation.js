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
  Text,
  Footer
} from "native-base";
import { Navigation } from "react-native-navigation";

import RNPickerSelect from "react-native-picker-select";
import validate from "../../utility/validation";
import CustomButton from "../../components/CustomButton/CustomButton";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import scan from "../../assets/images/scan.png";
import menu from "../../assets/images/menu.png";

class BankInformationScreen extends Component {
  state = {
    menuState: false,
    activityDisplay: false,
    selectedAccount: 0,
    controls: {
      holder_name: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      account_number: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 10
        }
      },
      routing_number: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 9
        }
      }
    },
    account_type: [
      {
        value: "individual",
        label: "Individual"
      },
      {
        value: "company",
        label: "Company"
      }
    ]
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
    console.log("Component Did Mount");
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

  setAccountType(d) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedAccount: d
      };
    });
  }

  updateInputState = (key, value) => {
    console.log("Key -> " + key);
    console.log("Value -> " + value);
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

  setBankInfo = () => {
    console.log(
      "Account Holder Name -> " + this.state.controls.holder_name.value
    );
    console.log(
      "Routing Number -> " + this.state.controls.routing_number.value
    );
    console.log(
      "Account Number -> " + this.state.controls.account_number.value
    );
    console.log("Account Type -> " + this.state.selectedAccount);

    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });

    let errors = [];

    if (
      !validate(
        this.state.controls.holder_name.value,
        this.state.controls.holder_name.validationRules
      )
    ) {
      errors.push("- Please add the account holder name.");
    }

    if (
      !validate(
        this.state.controls.routing_number.value,
        this.state.controls.routing_number.validationRules
      )
    ) {
      errors.push("- Routing Number Invalid.");
    }

    if (
      !validate(
        this.state.controls.account_number.value,
        this.state.controls.account_number.validationRules
      )
    ) {
      errors.push("- Account Number Invalid.");
    }

    if (this.state.selectedAccount == 0) {
      errors.push("- Please select the account Type.");
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
          "Bank Account Information Error",
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
      let bank_info = {
        holder_name: this.state.controls.holder_name.value,
        account_number: this.state.controls.account_number.value,
        routing_number: this.state.controls.routing_number.value,
        selectedAccount: this.state.selectedAccount
      };
      let cc_info = {
        info: "no"
      };
      bank_info = JSON.stringify(bank_info);
      cc_info = JSON.stringify(cc_info);
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE plan SET cc_info = '" + cc_info + "' WHERE ID = 1",
          [],
          (tx, results) => {
            console.log("UPDATING BANK INFO", results);
            if (results.rowsAffected == 1) {
              tx.executeSql(
                "UPDATE plan SET bank_info = '" + bank_info + "' WHERE ID = 1",
                [],
                (tx, results) => {
                  console.log("UPDATING CC INFO", results);
                  if (results.rowsAffected == 1) {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        activityDisplay: false
                      };
                    });
                    this.goToScreen("PaymentOptionsScreen");
                  }
                }
              );
            }
          }
        );
      });
    }
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
            <Text style={styles.text1}>Bank Account Information</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value =>
                this.updateInputState("holder_name", value)
              }
              value={this.state.controls.holder_name.value}
              placeholder="Account Holder Name"
              placeholderTextColor="#0F195B"
              keyboardType="default"
            />
          </View>
          <View style={styles.row}>
            <RNPickerSelect
              placeholder={{
                label: "Select Account Type...",
                value: null,
                color: "#01396F"
              }}
              items={this.state.account_type}
              hideIcon={true}
              onValueChange={value => {
                this.setAccountType(value);
              }}
              value={this.state.selectedAccount}
              onUpArrow={() => {
                this.inputRefs.name.focus();
              }}
              onDownArrow={() => {
                this.inputRefs.picker2.togglePicker();
              }}
              style={{ ...pickerSelectStyles }}
              ref={el => {
                this.inputRefs.picker = el;
              }}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value =>
                this.updateInputState("routing_number", value)
              }
              value={this.state.controls.routing_number.value}
              placeholder="Routing Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value =>
                this.updateInputState("account_number", value)
              }
              value={this.state.controls.account_number.value}
              placeholder="Account Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.nextBt}>
            <CustomButton
              title="VIEW PAYMENT OPTIONS"
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
              onPressHandler={() => this.setBankInfo()}
            />
          </View>
          <View style={styles.back}>
            <Text style={styles.steps}>3 of 4</Text>
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
  scanText: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  scan: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "94%"
  },
  cardImg: {
    width: 40,
    justifyContent: "center",
    alignItems: "center"
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
    marginTop: 5,
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

export default BankInformationScreen;
