import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {baseUrl} from '../../../Helpers/Config';
import {useNavigation} from '@react-navigation/native';
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('dung+octopus4@101digital.io');
  const [password, setPassword] = useState('Abc@123456');
  const getToken = async () => {
    const body = {
      client_id: 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa',
      client_secret: '0Exp4dwqmpON_ezyhfm0o_Xkowka',
      grant_type: 'password',
      scope: 'openid',
      username: email,
      password: password,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    try {
      const res = await axios.post(
        `${baseUrl}/token?tenantDomain=carbon.super`,
        body,
        config,
      );
      navigation.navigate('ListView', {
        data: res.data.access_token,
      });
    } catch (error) {
      navigation.navigate('ListView');
      console.log('err', error);
      Alert.alert('something went wrong please try again');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={[styles.buttonText, {color: 'darkred'}]}>
        Generate Access Token
      </Text>
      <View style={styles.textInputBox}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
        />
      </View>
      <View style={styles.textInputBox}>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
        />
      </View>
      <TouchableOpacity onPress={() => getToken()} style={styles.button}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputBox: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'darkred',
    height: 60,
    justifyContent: 'center',
    padding: '2%',
    margin: '2%',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'darkred',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});
