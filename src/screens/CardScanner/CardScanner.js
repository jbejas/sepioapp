import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Navigation } from "react-native-navigation";
import { CardIOView, CardIOUtilities } from "react-native-awesome-card-io";
import Image from "react-native-remote-svg";

// IMAGES
import logo from "../../assets/images/logo.svg";

class CardScannerScreen extends Component {
  state = {
    menuState: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentWillMount() {
    CardIOUtilities.preload();
  }

  didScanCard = card => {
    console.log("Card", card);

    Navigation.push(this.props.componentId, {
      component: {
        name: "CardInformationScreen",
        passProps: {
          card: card
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
        <View style={styles.element}>
          <Image source={logo} />
          <Text style={styles.text1}>Card Scanner</Text>
          <CustomButton
            title="CANCEL"
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
            onPressHandler={() => this.goBack()}
          />
        </View>
        <CardIOView
          didScanCard={this.didScanCard}
          useCardIOLogo={true}
          hideCardIOLogo={true}
          style={styles.CardIO}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01396F",
    flexDirection: "column"
  },
  element: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: "column",
    width: "100%"
  },
  CardIO: {
    flex: 2,
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0
  },
  text1: {
    //color: "#01396F",
    color: "#FFF",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10
  }
});

export default CardScannerScreen;
