import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {baseUrl} from '../../Helpers/Config';
import {useSelector} from 'react-redux';

const AddInovice = ({route, navigation}) => {
  //getting data from store
  const userData = useSelector(state => state.userProfile.userData);

  const [invoiceRef, setInvoiceRef] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const addInvoice = async () => {
    const body = {
      invoiceReference: invoiceRef,
      invoiceDate: date,
      description: description,
      totalAMount: amount,
    };
    const config = {
      headers: {
        Authorization: 'Bearer' + ' ' + userData.accessToken,
      },
      'org-token': userData.orgToken,
    };
    try {
      const res = await axios.post(
        `${baseUrl}/invoice-service/2.0.0/invoices`,
        body,
        config,
      );
      navigation.goBack();
      console.log('res', res);
    } catch (error) {
      console.log('err', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Invoice</Text>
      <View style={styles.inputContainer}>
        <TextInput
          numberOfLines={1}
          value={invoiceRef}
          onChangeText={text => setInvoiceRef(text)}
          style={styles.input}
          placeholder="Invoice Reference"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          numberOfLines={1}
          value={date}
          onChangeText={text => setDate(text)}
          style={styles.input}
          placeholder="Date"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          numberOfLines={1}
          value={description}
          onChangeText={text => setDescription(text)}
          style={styles.input}
          placeholder="Description"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          numberOfLines={1}
          value={amount}
          onChangeText={text => setAmount(text)}
          style={styles.input}
          placeholder="Amount"
        />
      </View>
      <TouchableOpacity onPress={() => addInvoice()} style={styles.button}>
        <Text style={styles.buttonText}>Create Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddInovice;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
