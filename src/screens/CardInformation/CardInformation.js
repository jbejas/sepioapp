import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Platform
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
import scan from "../../assets/images/scan.png";
import menu from "../../assets/images/menu.png";

class CardInformationScreen extends Component {
  state = {
    menuState: false,
    activityDisplay: false,
    selectedMonth: 0,
    selectedYear: 0,
    controls: {
      card_name: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 2
        }
      },
      card_number: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 16
        }
      },
      ccv: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 3
        }
      }
    },
    years: [
      {
        value: 0,
        label: "--"
      }
    ],
    months: [
      {
        value: 1,
        label: "January"
      },
      {
        value: 2,
        label: "February"
      },
      {
        value: 3,
        label: "March"
      },
      {
        value: 4,
        label: "April"
      },
      {
        value: 5,
        label: "May"
      },
      {
        value: 6,
        label: "June"
      },
      {
        value: 7,
        label: "July"
      },
      {
        value: 8,
        label: "August"
      },
      {
        value: 9,
        label: "September"
      },
      {
        value: 10,
        label: "October"
      },
      {
        value: 11,
        label: "November"
      },
      {
        value: 12,
        label: "December"
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

    if (this.props.card) {
      this.updateInputState("card_number", this.props.card.cardNumber);
      this.setYear(this.props.card.expiryYear);
      this.setMonth(this.props.card.expiryMonth);
    }

    let current_year = new Date().getFullYear();
    let max_year = current_year + 10;
    let years = [];
    for (let i = current_year; i <= max_year; i++) {
      years.push({
        label: current_year.toString(),
        value: current_year
      });
      current_year++;
    }

    console.log("Years", years);

    this.setState(prevState => {
      return {
        ...prevState,
        years: years
      };
    });
    console.log("Years", years);
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

  setMonth(d) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedMonth: d
      };
    });
  }

  setYear(d) {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedYear: d
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

  setCCInfo = () => {
    console.log("Name on Card -> " + this.state.controls.card_name.value);
    console.log("Card Number -> " + this.state.controls.card_number.value);
    console.log("CCV -> " + this.state.controls.ccv.value);

    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });

    let errors = [];

    if (
      !validate(
        this.state.controls.card_name.value,
        this.state.controls.card_name.validationRules
      )
    ) {
      errors.push("- Please add the Name on the Card.");
    }

    if (
      !validate(
        this.state.controls.card_number.value,
        this.state.controls.card_number.validationRules
      )
    ) {
      errors.push("- Card Number Invalid.");
    }

    if (
      !validate(
        this.state.controls.ccv.value,
        this.state.controls.ccv.validationRules
      )
    ) {
      errors.push("- Invalid Security Code Number.");
    }

    if (this.state.selectedMonth == 0) {
      errors.push("- Please select the Expiration Month.");
    }

    if (this.state.selectedYear == 0) {
      errors.push("- Please select the Expiration Year.");
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
          "Credit Card Information Error",
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
      let credit_card = {
        card_name: this.state.controls.card_name.value,
        card_number: this.state.controls.card_number.value,
        ccv: this.state.controls.ccv.value,
        month: this.state.selectedMonth,
        year: this.state.selectedYear
      };
      let bank_info = {
        info: "no"
      };
      credit_card = JSON.stringify(credit_card);
      bank_info = JSON.stringify(bank_info);
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE plan SET bank_info = '" + bank_info + "' WHERE ID = 1",
          [],
          (tx, results) => {
            console.log("UPDATING BANK INFO", results);
            if (results.rowsAffected == 1) {
              tx.executeSql(
                "UPDATE plan SET cc_info = '" + credit_card + "' WHERE ID = 1",
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
    let scanCard;
    if (Platform.OS == "ios") {
      scanCard = (
        <View style={styles.scan}>
          <Text style={styles.scanText}>Scan Card</Text>
          <TouchableOpacity
            style={styles.cardImg}
            onPress={() => this.goToScreen("CardScannerScreen")}
          >
            <Image source={scan} />
          </TouchableOpacity>
        </View>
      );
    } else {
      scanCard = (
        <View style={styles.scan}>
          <Text style={styles.scanText}>{"\n"}</Text>
        </View>
      );
    }

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
            <Text style={styles.text1}>Credit Card Information</Text>
          </View>
          {scanCard}
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value => this.updateInputState("card_name", value)}
              placeholder="Name on Card"
              placeholderTextColor="#0F195B"
              keyboardType="default"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value =>
                this.updateInputState("card_number", value)
              }
              value={this.state.controls.card_number.value}
              placeholder="Card Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={value => this.updateInputState("ccv", value)}
              value={this.state.controls.ccv.value}
              placeholder="Security Code"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.dob}>
            <Text style={styles.dobText}>Expiration Date</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.containerColStart}>
              <RNPickerSelect
                placeholder={{
                  label: "Select Month...",
                  value: null,
                  color: "#01396F"
                }}
                items={this.state.months}
                hideIcon={true}
                onValueChange={value => {
                  this.setMonth(value);
                }}
                value={this.state.selectedMonth}
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
            <View style={styles.containerColEnd}>
              <RNPickerSelect
                placeholder={{
                  label: "Select Year...",
                  value: null,
                  color: "#01396F"
                }}
                items={this.state.years}
                hideIcon={true}
                onValueChange={value => {
                  this.setYear(value);
                }}
                value={this.state.selectedYear}
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
              onPressHandler={() => this.setCCInfo()}
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
  scanText: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  scan: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "94%",
    marginLeft: "3%"
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

export default CardInformationScreen;
