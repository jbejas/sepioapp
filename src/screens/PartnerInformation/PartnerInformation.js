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
  Text
} from "native-base";
import { Navigation } from "react-native-navigation";

import CustomButton from "../../components/CustomButton/CustomButton";
import DatePicker from "react-native-datepicker";
import validate from "../../utility/validation";
import { CheckBox } from "react-native-elements";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import menu from "../../assets/images/menu.png";

class PartnerInformationScreen extends Component {
  state = {
    menuState: false,
    activityDisplay: false,
    currentDate: "",
    selectedDate: null,
    checked: true,
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
    }
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    currentDate =
      currentDate.getMonth() +
      "-" +
      currentDate.getDate() +
      "-" +
      currentDate.getFullYear();
    console.log("Current Date -> " + currentDate);
    this.setState(prevState => {
      return {
        ...prevState,
        currentDate: currentDate
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

  savePartnerInformation = () => {
    console.log("Email -> " + this.state.controls.email.value);
    console.log("First Name -> " + this.state.controls.first_name.value);
    console.log("Last Name -> " + this.state.controls.last_name.value);
    console.log("Phone -> " + this.state.controls.phone.value);

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

    if (!this.state.selectedDate) {
      errors.push("- Invalid Date of Birth.");
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
      let partner_information = {
        first_name: this.state.controls.first_name.value,
        last_name: this.state.controls.last_name.value,
        phone: this.state.controls.phone.value,
        email: this.state.controls.email.value,
        dob: this.state.selectedDate
      };
      partner_information = JSON.stringify(partner_information);
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE plan SET partner_information = '" +
            partner_information +
            "' WHERE ID = 1",
          [],
          (tx, results) => {
            console.log("UPDATING PARTNER INFORMATION", results);
            if (results.rowsAffected == 1) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  activityDisplay: false
                };
              });
              if (this.state.checked) {
                this.goToScreen("BillingInformationScreen");
              } else {
                this.goToScreen("PartnerAddressScreen");
              }
            }
          }
        );
      });
    }
  };

  setDate(d) {
    console.log("Date", d);
    this.setState(prevState => {
      return {
        ...prevState,
        selectedDate: d
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

  setChecked() {
    if (this.state.checked) {
      this.setState(prevState => {
        return {
          ...prevState,
          checked: false
        };
      });
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          checked: true
        };
      });
    }
  }

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
            <Text style={styles.text1}>
              Family Member / Partner Information
            </Text>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.emailInput}
              onChangeText={email => this.updateInputState("email", email)}
              placeholder="Email Address"
              placeholderTextColor="#0F195B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.containerColStart}>
              <TextInput
                style={styles.firstnameInput}
                onChangeText={first_name =>
                  this.updateInputState("first_name", first_name)
                }
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
              placeholder="Phone Number"
              placeholderTextColor="#0F195B"
              keyboardType="number-pad"
              autoCorrect={false}
            />
          </View>
          <View style={styles.dob}>
            <Text style={styles.dobText}>Date of Birth</Text>
          </View>
          <View style={styles.row}>
            <DatePicker
              style={{ width: "100%" }}
              date={this.state.selectedDate}
              mode="date"
              placeholder="SELECT DATE OF BIRTH"
              format="MM-DD-YYYY"
              minDate="1900-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              androidMode="spinner"
              customStyles={{
                dateTouch: {
                  width: "100%"
                },
                dateText: {
                  color: "#01396F",
                  fontSize: 15
                },
                dateInput: {
                  flex: 1,
                  height: 40,
                  borderWidth: 0,
                  borderColor: "#aaa",
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#efefef"
                }
              }}
              onDateChange={new_date => {
                this.setDate(new_date);
              }}
            />
          </View>
          <View style={styles.dob}>
            <CheckBox
              center
              title="Family Member / Partner lives at the same address."
              checkedColor="#F3407B"
              containerStyle={{
                marginLeft: -1,
                marginVertical: 0,
                width: "100%"
              }}
              checked={this.state.checked}
              onPress={() => this.setChecked()}
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
              onPressHandler={() => this.savePartnerInformation()}
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
    fontSize: 19,
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

export default PartnerInformationScreen;
