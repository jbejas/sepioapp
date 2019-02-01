/*import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import configureStore from './src/store/configureStore';

const store = configureStore();

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);*/

import { Navigation } from "react-native-navigation";
import StartScreen from "./src/screens/Start/Start";
import LoginScreen from "./src/screens/Login/Login";
import SignupScreen from "./src/screens/Signup/Signup";
import PlanScreen from "./src/screens/Plan/Plan";
import CardScannerScreen from "./src/screens/CardScanner/CardScanner";
import ContactInformationScreen from "./src/screens/ContactInformation/ContactInformation";
import ContactAddressScreen from "./src/screens/ContactAddress/ContactAddress";
import BillingInformationScreen from "./src/screens/BillingInformation/BillingInformation";
import CardInformationScreen from "./src/screens/CardInformation/CardInformation";
import BankInformationScreen from "./src/screens/BankInformation/BankInformation";
import PaymentOptionsScreen from "./src/screens/PaymentOptions/PaymentOptions";
import MenuScreen from "./src/screens/Menu/Menu";
import ForgotPasswordScreen from "./src/screens/ForgotPassword/ForgotPassword";
import SettingsScreen from "./src/screens/Settings/Settings";
import CustomersScreen from "./src/screens/Customers/Customers";

console.disableYellowBox = true;

Navigation.registerComponent("StartScreen", () => StartScreen);
Navigation.registerComponent("LoginScreen", () => LoginScreen);
Navigation.registerComponent("SignupScreen", () => SignupScreen);
Navigation.registerComponent("PlanScreen", () => PlanScreen);
Navigation.registerComponent("CardScannerScreen", () => CardScannerScreen);
Navigation.registerComponent(
  "ContactInformationScreen",
  () => ContactInformationScreen
);

Navigation.registerComponent(
  "BankInformationScreen",
  () => BankInformationScreen
);

Navigation.registerComponent(
  "ContactAddressScreen",
  () => ContactAddressScreen
);

Navigation.registerComponent(
  "BillingInformationScreen",
  () => BillingInformationScreen
);

Navigation.registerComponent(
  "CardInformationScreen",
  () => CardInformationScreen
);

Navigation.registerComponent(
  "PaymentOptionsScreen",
  () => PaymentOptionsScreen
);

Navigation.registerComponent("MenuScreen", () => MenuScreen);

Navigation.registerComponent(
  "ForgotPasswordScreen",
  () => ForgotPasswordScreen
);

Navigation.registerComponent("SettingsScreen", () => SettingsScreen);

Navigation.registerComponent("CustomersScreen", () => CustomersScreen);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    statusBar: {
      hideWithTopBar: false,
      blur: true
    },
    popGesture: true,
    topBar: {
      visible: false,
      hideOnScroll: false,
      background: {
        color: "#01396F"
      },
      noBorder: true,
      animate: false
    },
    sideMenu: {
      openGestureMode: "bezel", // 'entireScreen' | 'bezel'
      left: {
        shouldStretchDrawer: false, // defaults to true, when false sideMenu contents not stretched when opened past the width
        animationVelocity: 1000, // defaults to 840, high number is a faster sideMenu open/close animation
        animationType: "slide" // defaults to none if not provided, options are 'parallax', 'door', 'slide', or 'slide-and-scale'
      }
    }
  });

  Navigation.setRoot({
    root: {
      sideMenu: {
        id: "sideMenu",
        left: {
          component: {
            id: "Drawer",
            name: "MenuScreen"
          }
        },
        center: {
          stack: {
            id: "AppRoot",
            children: [
              {
                component: {
                  id: "AppStack",
                  //name: "StartScreen"
                  name: "PaymentOptionsScreen"
                }
              }
            ]
          }
        }
      }
    }
  });
});
