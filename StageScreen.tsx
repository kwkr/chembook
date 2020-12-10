import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Button,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDb} from './useDb';
import * as ImagePicker from 'react-native-image-picker';
import {Icon} from 'react-native-elements';
import {hasAndroidPermission} from './utils';
import Lightbox from 'react-native-lightbox';

const styles = StyleSheet.create({
  experimentName: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: Colors.black,
    borderWidth: 1,
    padding: 4,
    backgroundColor: Colors.white,
  },
  widget: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: Colors.black,
    borderWidth: 1,
    padding: 8,
    margin: 8,
  },
  widgetWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButtonsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
  icon: {width: 26, height: 26},
  title: {fontSize: 16},
});

function defaultDescriptionValue() {
  return new Date().toLocaleString() + '\n';
}

export const StageScreen = ({route, navigator}) => {
  const phaseId = route.params.id;
  const [widgets, setWidgets] = useState([]);
  const [widgetDescriprion, setWidgetDescription] = useState(
    defaultDescriptionValue(),
  );
  const [currentPhoto, setCurrentPhoto] = useState('');
  const {addWidget, fetchWidgets, deleteWidget} = useDb();
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    async function getData() {
      const widgetsResult = await fetchWidgets(phaseId);
      setWidgets(widgetsResult);
    }
    getData();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{padding: 8}}>
            <Text style={{paddingBottom: 8, ...styles.title}}>
              {'Widget description'}
            </Text>
            <TextInput
              onChangeText={setWidgetDescription}
              multiline
              value={widgetDescriprion}
              style={styles.experimentName}
            />
          </View>
          <View style={styles.photoButtonsWrapper}>
            <Button
              title="Add Photo"
              onPress={async () => {
                ImagePicker.launchImageLibrary(
                  {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  async (response) => {
                    if (response.didCancel) {
                    } else {
                      setCurrentPhoto(response.uri);
                    }
                  },
                );
              }}
            />
            <Button
              title="Make Photo"
              onPress={async () => {
                if (Platform.OS === 'android') {
                  await hasAndroidPermission();
                }
                ImagePicker.launchCamera(
                  {
                    mediaType: 'photo',
                    saveToPhotos: true,
                    includeBase64: false,
                  },
                  async (response) => {
                    if (response.didCancel) {
                    } else {
                      setCurrentPhoto(response.uri);
                    }
                  },
                );
              }}
            />
            {currentPhoto === '' ? null : (
              <Button
                title="Remove photo"
                onPress={async () => {
                  setCurrentPhoto('');
                }}
              />
            )}
          </View>
          {currentPhoto === '' ? null : (
            <View
              style={{
                padding: 8,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{'Widget photo'}</Text>
              <View style={{padding: 8}}>
                <Image
                  source={{uri: currentPhoto}}
                  style={{height: 100, width: 100}}
                />
              </View>
            </View>
          )}

          <View style={{padding: 8}}>
            <Button
              title="Add widget"
              disabled={widgetDescriprion === ''}
              onPress={async () => {
                setWidgetDescription(defaultDescriptionValue());
                setCurrentPhoto('');
                await addWidget(widgetDescriprion, currentPhoto, phaseId);
                let currentWidgets = await fetchWidgets(phaseId);
                setWidgets(currentWidgets);
              }}
            />
          </View>
          <View>
            {widgets.length === 0 ? (
              <Text style={{paddingHorizontal: 8}}>{'No widgets yet'}</Text>
            ) : (
              widgets.map(({resourceUrl, content, id}) => {
                return (
                  <View key={id} style={styles.widget}>
                    <View style={styles.widgetWrapper}>
                      <View style={{flex: 1, flexGrow: 2}}>
                        <Text style={{padding: 8}}>{content}</Text>
                      </View>
                      <View
                        style={{
                          paddingBottom: 20,
                          flex: 1,
                          alignItems: 'flex-end',
                          width: windowWidth * 0.3,
                        }}>
                        {resourceUrl === '' ? null : (
                          <Lightbox navigator={navigator}>
                            <Image
                              source={{uri: resourceUrl}}
                              style={{
                                flex: 1,
                                minWidth: windowWidth * 0.3,
                                minHeight: 100,
                              }}
                            />
                          </Lightbox>
                        )}
                        <View style={styles.icon}>
                          <Icon
                            name="delete"
                            onPress={async () => {
                              await deleteWidget(id);
                              let currentWidgets = await fetchWidgets(phaseId);
                              setWidgets(currentWidgets);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
