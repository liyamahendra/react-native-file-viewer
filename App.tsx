import * as React from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

interface componentNameProps { }

const componentName = (props: componentNameProps) => {
  const demoURL = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';

  const [value, onChangeText] = React.useState(demoURL);
  const [isLoading, setIsLoading] = React.useState(false);

  function getExtension(url: string) {
    var extension: string | undefined;
    if (url && url.length > 0) {
      url = url.substr(1 + url.lastIndexOf("/"));
      url = url.split('?')[0];
      url = url.split('#')[0];

      if (url.indexOf(".") != -1) {
        extension = url.split('.').pop();
      }
    }
    return extension;
  }

  const informUser = (message: string) => {
    Alert.alert(
      "",
      message,
      [
        { text: "OK", onPress: () => { } }
      ],
      { cancelable: false }
    );
  }

  const previewFile = () => {

    if (!value || value.length == 0) {
      return informUser("Please provide the url of the document to preview");
    }

    var extension = getExtension(value);
    if (!extension || extension.length == 0) {
      return informUser("Couldn't determine the file type, as the extension of the document is not present.");
    }

    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${getExtension(value)}`;
    const options = {
      fromUrl: value,
      toFile: localFile
    };

    setIsLoading(true)

    RNFS.downloadFile(options).promise
      .then(() => { 
        setIsLoading(false);
        FileViewer.open(localFile) 
      })
  }

  const showLoader = () => {
    if (isLoading) {
      return <ActivityIndicator style={styles.loader} size="large" color="#ff0000" />;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {showLoader()}
      <Text>Document URL To Preview</Text>
      <TextInput
        style={styles.inputText}
        onChangeText={text => onChangeText(text)}
        value={value}
      />
      <Button title="Preview File" onPress={previewFile} />
    </SafeAreaView>
  );
};

export default componentName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: {
    padding: 8,
    height: 44,
    minWidth: "90%",
    margin: 12,
    borderColor: 'gray',
    borderWidth: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
