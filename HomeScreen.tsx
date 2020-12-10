import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDb} from './useDb';
import {Icon} from 'react-native-elements';

const styles = StyleSheet.create({
  experimentName: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: Colors.black,
    borderWidth: 1,
    padding: 4,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  body: {
    marginTop: 32,
  },
  sectionContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
});

export const HomeScreen = ({navigation}) => {
  const {experiments, addExperiment, deleteExperiment} = useDb();
  const [titleInput, setTitleInput] = useState('');
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              {experiments.length === 0 ? (
                <Text>No experiments yet</Text>
              ) : (
                experiments.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 8,
                    }}>
                    <View style={{flexGrow: 1}}>
                      <Button
                        title={`${item.title}`}
                        onPress={() => {
                          navigation.navigate('Experiment', {
                            id: item.id,
                            title: item.title,
                          });
                        }}
                      />
                    </View>

                    <View style={{width: 20, marginLeft: 16}}>
                      <Icon
                        name="delete"
                        onPress={async () => {
                          Alert.alert(
                            'Delete experiment',
                            `Are you sure you want to delete the experiment with id:${item.id} "${item.title}"? It will delete all the phases and widgets associated with it!`,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: async () => {
                                  await deleteExperiment(item.id);
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Add Experiment</Text>
              <TextInput
                onChangeText={setTitleInput}
                value={titleInput}
                style={styles.experimentName}
                placeholder={'Experiment name'}
              />
              <Button
                title="Insert experiment"
                disabled={titleInput === ''}
                onPress={() => {
                  setTitleInput('');
                  addExperiment(titleInput);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
