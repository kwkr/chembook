import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
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
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
});

export const ExperimentScreen = ({navigation, route}) => {
  const experimentId = route.params.id;
  const {fetchPhases, addPhase, deleteStage} = useDb();
  const [phaseInput, setPhaseInput] = useState('');
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const phasesResult = await fetchPhases(experimentId);
      console.log(phasesResult);
      setPhases(phasesResult);
    }
    fetchData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View
            style={{
              marginTop: 24,
            }}>
            <View style={{paddingHorizontal: 8, paddingBottom: 8}}>
              <Text style={styles.title}>{'Stages'}</Text>
            </View>
            {phases.length === 0 ? (
              <View style={{paddingHorizontal: 8}}>
                <Text style={styles.title}>{'No stages yet'}</Text>
              </View>
            ) : (
              phases.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 8,
                  }}>
                  <View style={{flexGrow: 1}}>
                    <Button
                      title={`${item.title}`}
                      onPress={() => {
                        navigation.navigate('Stage', {
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
                          `Are you sure you want to delete the stage with "${item.title}"? It will delete all the widgets associated with it!`,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: async () => {
                                await deleteStage(item.id);
                                const phasesResult = await fetchPhases(
                                  experimentId,
                                );
                                setPhases(phasesResult);
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

          <View style={{padding: 8}}>
            <Text style={styles.title}>Add Stage</Text>
            <View style={{paddingBottom: 8, paddingTop: 8}}>
              <TextInput
                onChangeText={setPhaseInput}
                value={phaseInput}
                style={styles.experimentName}
                placeholder={'Stage description'}
              />
            </View>
            <Button
              title="Insert new stage"
              disabled={phaseInput === ''}
              onPress={async () => {
                setPhaseInput('');
                addPhase(phaseInput, experimentId);
                const phasesResult = await fetchPhases(experimentId);
                setPhases(phasesResult);
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
