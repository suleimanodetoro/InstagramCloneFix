import Navigation from "./src/navigation";
//To enable uuid work fine...
import 'react-native-get-random-values'

import {Button} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Amplify, Auth } from "aws-amplify";
import Client from "./src/apollo/Client";
//To use pop up module installed =>
import { MenuProvider } from "react-native-popup-menu";
//library to refacted createdAt data form AWS 
import relativeTime from 'dayjs/plugin/relativeTime';
import * as dayjs from 'dayjs';
dayjs.extend(relativeTime);


// AWS related imports
import config from "./src/aws-exports";
import AuthContextProvider from "./src/contexts/AuthContext";
Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthContextProvider>
          <Client>
            <Navigation />
          </Client>
        </AuthContextProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;