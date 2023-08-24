import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<UploadStackNavigatorParamList>();
import { View, Text } from "react-native";
import React from "react";
import CameraScreen from "../screens/CameraScreen/CameraScreen";
import CreatePostScreen from "../screens/CreatePostScreen/CreatePostScreen";
import { UploadStackNavigatorParamList } from "../types/navigation";

export default function UploadStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Create" component={CreatePostScreen} />
    </Stack.Navigator>
  );
}
