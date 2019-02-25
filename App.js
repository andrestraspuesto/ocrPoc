import React from 'react';
import { StyleSheet, Text, ScrollView, Button } from 'react-native';
import {OCR_API_KEY} from 'react-native-dotenv';
import {Permissions, ImagePicker, FileSystem, Constants} from 'expo';
import {imageToJson} from './src/ocr_cli/OcrCli'

const MAX_FILE_SIZE = 1024000

export default class App extends React.Component {
  state = {
    image: null,
    uploading: false,
    text: '',
    error: '',
  }

  render() {
    console.log(OCR_API_KEY)
    return (
      <ScrollView style={styles.container}>
        <Button onPress={this._pickTicket} 
          title="Choose"
          disabled={this.state.uploading}
        />
        <Text>{this.state.error}</Text>
        <Text>{this.state.text}</Text>
      </ScrollView>
    );
  }

  _pickTicket = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        aspect: [4, 3],
        base64: true
      });
      if(!pickerResult.cancelled){
        const fileInfo = await FileSystem.getInfoAsync(pickerResult.uri, {size:true})
        if(fileInfo.size <= MAX_FILE_SIZE ){
          this.setState({uploading: true})
          const json = await imageToJson(pickerResult.base64, OCR_API_KEY)
          let text = ''
          let error = ''
          if(json.success){
            text = json.text
          } else {
            error = json.text
          }
          this.setState({uploading: false, text: text, error: error})
        }
        
      }
      
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight
  },
});
