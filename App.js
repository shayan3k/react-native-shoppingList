/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {Container, List, ListItem, Content, Button, Icon} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  StatusBar,
  Dimensions,
  RefreshControlBase,
} from 'react-native';

const App: () => React$Node = () => {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('shoppinglist').then((res) => {
      const myObject = JSON.parse(res);
      console.log('recieving: ', myObject);
      Object.keys(myObject).length ? setList(myObject) : setList([]);
      setMsg('item retrived from DB');
    });
  }, []);

  useEffect(() => {
    msg.length
      ? setTimeout(() => {
          setMsg('');
        }, 2000)
      : '';
  }, [msg]);

  const updateDatabase = (theList) => {
    console.log('before Storing', theList);
    AsyncStorage.setItem('shoppinglist', JSON.stringify(theList))
      .then((res) => {
        AsyncStorage.getItem('shoppinglist').then((res) => {
          console.log('after storing: ', res);
          setMsg('List has been updated');
        });
      })
      .catch((e) => console.log(e));
  };

  const handleDeleteBtn = async (thisText) => {
    const newList = list.filter((item) => item != thisText);
    setList(newList);
    console.log('delete btn clicked');
    updateDatabase(newList);
  };

  const handleAddBtn = () => {
    setList([text, ...list]);
    console.log('Add btn clicked');
    updateDatabase([text, ...list]);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.textWhite}>Shopping List</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setText(text)}
          value={text}
        />
      </View>
      <View style={styles.btnContainer}>
        <Button full success onPress={() => handleAddBtn()}>
          <Text>Add</Text>
        </Button>
      </View>

      {msg ? (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{msg}</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Container>
        <Text style={styles.listTitle}>ITEMS: </Text>
        <Content style={styles.listContainer}>
          <List style={styles.list}>
            {list.map((item, index) => {
              return (
                <ListItem style={styles.listItem} key={index}>
                  <Text style={styles.listItemText}>{item}</Text>
                  <Button
                    danger
                    style={styles.listItemBtn}
                    onPress={() => handleDeleteBtn(item)}>
                    <Icon name="trash" />
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </Container>
    </>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#581845',
    height: (windowHeight * 10) / 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWhite: {
    color: 'white',
    fontSize: (windowHeight * 4) / 100,
  },
  inputView: {
    paddingHorizontal: (windowHeight * 10) / 100,
  },
  input: {
    height: (windowHeight * 10) / 100,
    borderBottomColor: 'black',
    borderBottomWidth: 5,
    fontSize: (windowHeight * 3) / 100,
  },

  btnContainer: {
    paddingHorizontal: (windowHeight * 10) / 100,
    paddingVertical: 8,
    marginBottom: 5,
  },

  listTitle: {
    paddingHorizontal: (windowHeight * 2) / 100,
    paddingVertical: 8,
    marginBottom: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    fontSize: (windowHeight * 4) / 100,
  },
  listContainer: {},
  list: {},
  listItem: {
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: (windowHeight * 3) / 100,
  },
  listItemBtn: {},
  alertContainer: {
    paddingHorizontal: (windowHeight * 10) / 100,
    paddingVertical: 8,
    marginBottom: 5,
  },
  alertText: {
    backgroundColor: '#E5D1D0',
    paddingHorizontal: (windowHeight * 2) / 100,
    paddingVertical: 8,
    borderRadius: (windowHeight * 1) / 100,
  },
});

export default App;
