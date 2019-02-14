import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Content, Text } from "native-base";
import CustomButton from "../../components/CustomButton/CustomButton";
import { Navigation } from "react-native-navigation";
import { CardIOModule, CardIOUtilities } from "react-native-awesome-card-io";

// IMAGES
import logo from "../../assets/images/logo.png";

class CardScannerScreen extends Component {
  state = {
    menuState: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentWillMount() {
    if (Platform.OS === "ios") {
      CardIOUtilities.preload();
    }
  }

  scanCard() {
    CardIOModule.scanCard.CardIOModule.scanCard()
      .then(card => {
        Navigation.push(this.props.componentId, {
          component: {
            name: "CardInformationScreen",
            passProps: {
              card: card
            },
            options: {
              topBar: {
                visible: false,
                height: 0
              }
            }
          }
        });
      })
      .catch(() => {
        this.goBack();
      });
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
      <Container>
        <Content style={{ backgroundColor: "#01396F" }}>
          <View style={styles.element}>
            <Image style={{ marginTop: 20 }} source={logo} />
            <Text style={styles.text1}>Card Scanner</Text>
            <TouchableOpacity onPress={() => this.scanCard()}>
              <Text>Scan card!</Text>
            </TouchableOpacity>
            <CustomButton
              title="SCAN CARD"
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
              onPressHandler={() => this.scanCard()}
            />
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
