import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";
import CustomButton from "../../components/CustomButton/CustomButton";
import Image from "react-native-remote-svg";

// IMAGES
import scan from "../../assets/images/scan.svg";
import menu from "../../assets/images/menu.png";

class CardInformationScreen extends Component {
  state = {
    menuState: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
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
    console.log("Screen Name -> " + screenName);
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSideMenu()}
          >
            <Image source={menu} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.text1}>Credit Card Information</Text>
        </View>
        <View style={styles.scan}>
          <Text style={styles.scanText}>Scan Card</Text>
          <TouchableOpacity
            style={styles.cardImg}
            onPress={() => this.goToScreen("CardScannerScreen")}
          >
            <Image source={scan} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.emailInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Name on Card"
            placeholderTextColor="#0F195B"
            keyboardType="default"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.emailInput}
            onChangeText={text => this.setState({ text })}
            placeholder="Card Number"
            placeholderTextColor="#0F195B"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.emailInput}
            onChangeText={text => this.setState({ text })}
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
            <TextInput
              style={styles.firstnameInput}
              onChangeText={text => this.setState({ text })}
              placeholder="Month"
              placeholderTextColor="#0F195B"
            />
          </View>
          <View style={styles.containerColEnd}>
            <TextInput
              style={styles.lastnameInput}
              onChangeText={text => this.setState({ text })}
              placeholder="Year"
              placeholderTextColor="#0F195B"
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
            onPressHandler={() => this.goToScreen("PaymentOptionsScreen")}
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

export default CardInformationScreen;
