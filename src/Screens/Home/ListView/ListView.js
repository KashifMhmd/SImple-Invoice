import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {baseUrl} from '../../../Helpers/Config';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {userDataCollector} from '../../../Reducers/userProfileData';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const ListView = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {data} = route.params;
  const dispatch = useDispatch();
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoicesData, setInvoicesData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orgToken, setOrgToken] = useState('');
  let filteredInvoices;
  const toggleModal = data => {
    if (data === 'date') {
      filteredInvoices = invoicesData.sort(
        (a, b) => b.invoiceDate - a.invoiceDate,
      );
      setIsModalVisible(!isModalVisible);
    } else if (data === 'high-low') {
      filteredInvoices = invoicesData.sort(
        (a, b) => b.totalAmount - a.totalAmount,
      );
      setIsModalVisible(!isModalVisible);
    } else if (data === 'low-high') {
      filteredInvoices = invoicesData.sort(
        (a, b) => a.totalAmount - b.totalAmount,
      );
      setIsModalVisible(!isModalVisible);
    } else {
      setIsModalVisible(!isModalVisible);
    }
  };

  //get profile information
  const getUserProfile = async () => {
    const config = {
      headers: {
        Authorization: 'Bearer' + ' ' + data,
      },
    };
    try {
      const res = await axios
        .get(`${baseUrl}/membership-service/1.2.0/users/me`, config)
        .then(res => {
          dispatch(
            userDataCollector({
              accessToken: data,
              orgToken: res?.data?.data?.memberships[0].organisationId,
            }),
          );
          const org_token = res?.data?.data?.memberships[0].organisationId;
          //callback to pass token as parameter
          setOrgToken(orgToken);
          getInvoices(org_token);
        });
    } catch (error) {
      console.log('err', error.message);
    }
  };
  //get the invoices
  const getInvoices = async token => {
    console.log('getInvoices', token);
    const config = {
      headers: {
        Authorization: 'Bearer' + ' ' + data,
      },
      'org-token': token,
    };
    console.log('confi', config);
    try {
      const res = await axios
        .get(`${baseUrl}/invoice-service/2.0.0/invoices`, config)
        .then(res => {
          setInvoicesData(res?.data?.data);
        });
    } catch (error) {
      console.log('err', error.message);
    }
  };

  const handleInvoiceSearch = text => {
    setInvoiceSearchQuery(text);
  };

  // for saerch bar to filter data through name and status
  // also sorting it with names in ascending order through local compare
  filteredInvoices = invoicesData
    .filter(
      invoice =>
        invoice.invoiceReference
          .toLowerCase()
          .includes(invoiceSearchQuery.toLowerCase()) ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(invoiceSearchQuery.toLowerCase()),
    )
    .sort((a, b) => a.invoiceNumber.localeCompare(b.customer_name));
  useEffect(() => {
    getUserProfile();
    console.log('refresh');
  }, [isFocused]);
  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddInvoice')}
          style={[styles.toggler, {backgroundColor: 'lightgreen'}]}>
          <Text>Add </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by Invoice Number or references"
          onChangeText={handleInvoiceSearch}
          value={invoiceSearchQuery}
        />
        {isModalVisible ? (
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => toggleModal('date')}>
              <Text>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModal('high-low')}>
              <Text>$(high-low)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModal('low-high')}>
              <Text>$(low-high)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.toggler} onPress={toggleModal}>
            <Text>Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollcontainer}
        style={{
          flexGrow: 1,
        }}>
        {filteredInvoices?.map((data, id) => {
          return (
            <View key={id} style={styles.listInvoices}>
              <Text>
                {'invoiceRef: '} {data.invoiceReference}
                {'\n'}
                {'Total Amount: '}
                {data.currencySymbol}
                {data.totalAmount}
                {'\n'}
                {'desc: '} {data.description}
                {'\n'}
                {'Invoice Date: '} {data.invoiceDate}
                {'\n'}
                {'Invoice No: '} {data.invoiceNumber}
                {'\n'}
                {'Due Date: '}
                {data.dueDate}
              </Text>

              <Text>{data.createdAt.substring(0, 10)}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width / 2.5,
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  listInvoices: {
    width: width / 1.1,
    height: 150,
    borderWidth: 1,
    borderRadius: 20,
    padding: '2%',
    margin: '1%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollcontainer: {
    alignItems: 'center',
    width: width,
  },
  toggler: {
    backgroundColor: 'grey',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  main: {
    alignItems: 'center',
    width: width,
    height: height,
  },
});
export default ListView;
