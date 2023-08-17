import Navigation from './src/navigation';

import { Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native'
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import React from 'react'
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react-native';
import Client from './src/apollo/Client';

// AWS related imports
import config from './src/aws-exports';
import { PasswordField } from '@aws-amplify/ui-react-native/dist/primitives';
import AuthContextProvider from './src/contexts/AuthContext';
//Because some changes made weren't reflected, we'll do the following=>
Amplify.configure(config);

const App = () => {
  return (
    <AuthContextProvider>
      <Client>
      <Navigation />

      </Client>
      
    </AuthContextProvider>
        

  )
};



export default App;



// import Navigation from './src/navigation';

// import { Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native'
// import {
//   SafeAreaProvider,
// } from 'react-native-safe-area-context';
// import React from 'react'
// import { Amplify, Auth } from 'aws-amplify';
// import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react-native';

// import config from './src/aws-exports';
// import { PasswordField } from '@aws-amplify/ui-react-native/dist/primitives';

// Amplify.configure(config);
// const formFields = {
//   signUp: {
//     username: {
//       order: 1
//     },
//     email: {
//       order: 2
//     },
//     name: {
//       order: 2,
//     },
//     password: {},
//     confirm_password: {

//     }

//   }
// }
// const App = () => {
//   return (
//     <Authenticator.Provider>
//       <Authenticator
//         components={{
//           SignUp: ({ fields, ...props }) => (
//             <Authenticator.SignUp
//               {...props}
//               fields={[
//                 {
//                   name:'name',
//                   label:'Name',
//                   type:'default',
//                   placeholder:'Kehinde Abereoje'
//                 },
//                 {
//                   name: 'username',
//                   label: 'Username',
//                   type: 'default',
//                   placeholder: 'Enter your preferred username',
//                 },
//                 {
//                   name: 'email',
//                   label: 'Email',
//                   type: 'default',
//                   placeholder: 'Enter your email',
//                 },
//                 {
//                   name: 'password',
//                   label: 'Password',
//                   type: 'password',
//                   placeholder: 'Enter your preferred password',
//                 },
//                 {
//                   name: 'confirm_password',
//                   label: 'Confirm Password',
//                   type: 'password',
//                   placeholder: 'Repeat same password',
//                 },
//               ]}
//             />
//           ),
//         }}
//       >
//         <Navigation />

//       </Authenticator>
//     </Authenticator.Provider>




//   )
// };



// export default App;
