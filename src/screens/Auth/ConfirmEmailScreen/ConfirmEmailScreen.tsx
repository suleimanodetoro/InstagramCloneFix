import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import FormInput from '../components/FormInput';
import CustomButton from '../components/CustomButton';
import SocialSignInButtons from '../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {
  ConfirmEmailNavigationProp,
  ConfirmEmailRouteProp,
} from '../../../types/navigation';
import {useRoute} from '@react-navigation/native';
import { Auth } from 'aws-amplify';

type ConfirmEmailData = {
  username: string;
  code: string;
};

const ConfirmEmailScreen = () => {
  const route = useRoute<ConfirmEmailRouteProp>();
  const {control, handleSubmit,watch} = useForm<ConfirmEmailData>({
    defaultValues: {username: route.params.username},
  });
  const usr = watch('username');//always keep a copy of data in the username field. This will be used in the resend function

  const navigation = useNavigation<ConfirmEmailNavigationProp>();
  const [loading, setLoading] = useState(false);

  const onConfirmPressed = async (data: ConfirmEmailData) => {
    if (loading) {
      return;     
    }
    setLoading(true);
    try {
      await Auth.confirmSignUp(data.username, data.code)
      navigation.navigate('Sign in');
      
      
    }catch (error) {
      Alert.alert('Hmm, this is odd🤔', (error as Error).message)
      
    } finally{
      setLoading(false);
    }
    
  };

  const onSignInPress = () => {
    navigation.navigate('Sign in');
  };

  const onResendPress = async () => {
    if (loading) {
      return;     
    }
    setLoading(true);
    try {
      await Auth.resendSignUp(usr);
      
    } catch (error) {
      Alert.alert('Darn digiddy dong!', (error as Error).message)
      
    } finally{
      setLoading(false);

    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>

        <FormInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: 'Username is required',
          }}
        />

        <FormInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{
            required: 'Confirmation code is required',
          }}
        />

        <CustomButton text={loading ? 'Loading...' :"Confirm"} onPress={handleSubmit(onConfirmPressed)} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY"
        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ConfirmEmailScreen;
