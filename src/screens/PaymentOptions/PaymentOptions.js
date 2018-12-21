import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";
import CustomButton from "../../components/CustomButton/CustomButton";
import Image from "react-native-remote-svg";
import arrow from "../../assets/images/arrow-down.svg";
import party from "../../assets/images/party.svg";
import menu from "../../assets/images/menu.png";

class PaymentOptionsScreen extends Component {
  state = {
    modalVisible: false,
    setContent: 1,
    menuState: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  setModalVisible(visible, content) {
    this.setState({ setContent: content, modalVisible: visible });
  }

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName,
        menuState: false
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

  modalClosed = () => {
    if (this.state.setContent == 2) {
      this.setState({ modalVisible: true });
    } else {
      Navigation.popToRoot(this.props.componentId);
    }
  };

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

  render() {
    const purchase = (
      <View style={styles.modalContent}>
        <Text style={styles.text1}>Purchase Complete</Text>
        <Text style={styles.text3}>Your customer will receive an</Text>
        <Text style={styles.text3}>email confirmation shortly</Text>
        <Image style={styles.party} source={party} />
        <CustomButton
          title="SEND REFERRAL LINK"
          width="90%"
          bgColor="#FFFFFF"
          paddingTop={14}
          paddingRight={10}
          paddingBottom={14}
          paddingLeft={10}
          marginBottom={15}
          textAlign="center"
          color="#01396F"
          fontWeight="bold"
          borderWidth={1}
          borderColor="#01396F"
          fontFamily="Avenir"
          fontSize={16}
          borderRadius={5}
          onPressHandler={() => this.setModalVisible(false, 2)}
        />
        <CustomButton
          title="HOME"
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
          onPressHandler={() => this.setModalVisible(false)}
        />
      </View>
    );

    const referral = (
      <View style={styles.modalContent}>
        <Text style={[styles.text1, styles.paddingBottom]}>Send a Link</Text>
        <Text style={styles.text3}>
          Your can send a customer a link to fill
        </Text>
        <Text style={styles.text3}>out the form themselves. Please</Text>
        <Text style={styles.text3}>choose one of the options below.</Text>
        <View style={[styles.row, styles.selectBox]}>
          <TextInput
            style={styles.select}
            onChangeText={text => this.setState({ text })}
            placeholder="Select a Customer"
            placeholderTextColor="#0F195B"
          />
          <Image style={styles.arrow} source={arrow} />
        </View>
        <View style={[styles.row, styles.selectBox]}>
          <TextInput
            style={styles.select}
            onChangeText={text => this.setState({ text })}
            placeholder="https://sepioguard.com/share?ref=Lorem Ipsum Dolor Sit Amet"
            placeholderTextColor="#0F195B"
          />
        </View>
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="VIA TEXT"
            width="47%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginBottom={15}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWidth={0}
            borderColor="#01396F"
            fontFamily="Avenir"
            fontSize={16}
            borderRadius={5}
            onPressHandler={() => this.setModalVisible(false)}
          />
          <CustomButton
            title="VIA EMAIL"
            width="47%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            marginBottom={15}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWidth={0}
            borderColor="#01396F"
            fontFamily="Avenir"
            fontSize={16}
            borderRadius={5}
            onPressHandler={() => this.setModalVisible(false)}
          />
        </View>
        <CustomButton
          title="HOME"
          width="90%"
          bgColor="#FFFFFF"
          paddingTop={14}
          paddingRight={10}
          paddingBottom={14}
          paddingLeft={10}
          marginBottom={15}
          textAlign="center"
          color="#F3407B"
          fontWeight="bold"
          borderWidth={0}
          borderColor="#01396F"
          fontFamily="Avenir"
          fontSize={16}
          borderRadius={5}
          onPressHandler={() => this.setModalVisible(false)}
        />
      </View>
    );

    let modalContent;
    console.log("Set Content -> " + this.props.setContent);
    if (this.state.setContent == 1) {
      console.log("Show Purchase");
      modalContent = purchase;
    } else {
      console.log("Show Referral");
      modalContent = referral;
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          onDismiss={() => this.modalClosed()}
        >
          <View style={styles.modalContainer}>{modalContent}</View>
        </Modal>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSideMenu()}
          >
            <Image source={menu} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.text1}>Payment Options</Text>
        </View>
        <View style={[styles.row, styles.selectBox]}>
          <TextInput
            style={styles.select}
            onChangeText={text => this.setState({ text })}
            placeholder="Select a payment option"
            placeholderTextColor="#0F195B"
          />
          <Image style={styles.arrow} source={arrow} />
        </View>
        <View style={styles.row1}>
          <Text style={styles.text2}>Total Due Today:</Text>
          <Text style={styles.text2}>$449</Text>
        </View>
        <View style={styles.nextBt}>
          <CustomButton
            title="COMPLETE PURCHASE"
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
            onPressHandler={() => this.setModalVisible(true, 1)}
          />
        </View>
        <View style={styles.back}>
          <Text style={styles.steps}>4 of 4</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30
  },
  row1: {
    width: "95%",
    height: 50,
    //backgroundColor: "green",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30
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
  select: {
    marginLeft: 15
  },
  selectBox: {
    backgroundColor: "#efefef",
    borderRadius: 5
  },
  arrow: {
    marginRight: 13,
    width: 9,
    height: 9
  },
  powered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%"
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  text2: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  text3: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  textPlan: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
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
  modalContainer: {
    flex: 1,
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.4)"
  },
  modalContent: {
    width: "85%",
    height: 460,
    backgroundColor: "#fefefe",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  party: {
    marginTop: 20,
    marginBottom: 20,
    width: 150,
    height: 147
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingTop: 20
  },
  row: {
    width: "80%",
    height: 50,
    //backgroundColor: "green",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 0
  }
});

export default PaymentOptionsScreen;
