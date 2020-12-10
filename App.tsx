/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {createContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './HomeScreen';
import {ExperimentScreen} from './ExperimentScreen';
import {StageScreen} from './StageScreen';
import SQLite from 'react-native-sqlite-storage';
import {Text, View} from 'react-native';

const Stack = createStackNavigator();
SQLite.enablePromise(true);

export const DbContext = createContext({} as any);

const App = () => {
  const [db, setDb] = useState(null);
  useEffect(() => {
    function loadDb() {
      SQLite.openDatabase({name: 'ChemistryDatabase.db'}).then((db) => {
        return new Promise((r) => {
          db.transaction((tx) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS "experiments"(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT);
            `,
            );
            tx.executeSql(`
            CREATE TABLE IF NOT EXISTS "experimentsPhase"(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text,
                "experimentId" INTEGER REFERENCES experiments(id) ON DELETE CASCADE
                );
            `);
            tx.executeSql(`
            CREATE TABLE IF NOT EXISTS "experimentsPhaseWidget"(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                resourceUrl TEXT,
                experimentPhaseId INTEGER REFERENCES "experimentsPhase"(id) ON DELETE CASCADE
                );
            `);
            setDb(db);
            r();
          });
        });
      });
    }
    loadDb();
  }, []);
  return db === null ? (
    <View>
      <Text>Loading db</Text>
    </View>
  ) : (
    <DbContext.Provider value={db}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Experiments'}}
          />
          <Stack.Screen
            name="Experiment"
            component={ExperimentScreen}
            options={({route}) => ({
              title: `Experiment '${route.params.title}'`,
            })}
          />
          <Stack.Screen
            name="Stage"
            component={StageScreen}
            options={({route}) => ({title: `Stage '${route.params.title}'`})}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DbContext.Provider>
  );
};

export default App;
