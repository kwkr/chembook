import SQLite from 'react-native-sqlite-storage';
import {useCallback, useContext, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {DbContext} from './App';

SQLite.enablePromise(true);

export function useDb() {
  const db = useContext(DbContext);
  const [experiments, setExperiments] = useState<any[]>([]);
  const fetchExperiments = useCallback(
    function () {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT id, title from "experiments";',
          [],
          (t, result) => {
            const rows = result.rows;
            const length = rows.length;
            const items: any[] = [];
            for (let k = 0; k < length; k++) {
              items.push(rows.item(k));
            }
            //console.log(items);
            setExperiments(items);
          },
        );
      });
    },
    [db],
  );
  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);
  function fetchPhases(experimentId: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * from "experimentsPhase" WHERE "experimentId" = ?;',
          [experimentId],
          (t, result) => {
            const rows = result.rows;
            const length = rows.length;
            const items = [];
            for (let k = 0; k < length; k++) {
              const item = rows.item(k);
              items.push(item);
            }
            resolve(items);
          },
        );
      });
    });
  }

  const addExperiment = (title: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO "experiments" (title) VALUES (?)',
        [title],
        (t, result) => {
          fetchExperiments();
        },
      );
    });
  };

  function deleteExperiment(experimentId: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE from "experiments" WHERE "id" = ?;',
          [experimentId],
          (t, result) => {
            fetchExperiments();
            resolve();
          },
        );
      });
    });
  }

  function addPhase(title: string, experimentId: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO "experimentsPhase" (title, "experimentId") VALUES (?,?);',
          [title, experimentId],
          (t, result) => {
            resolve();
          },
        );
      });
    });
  }

  function deleteStage(stageid: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE from "experimentsPhase" WHERE "id" = ?;',
          [stageid],
          (t, result) => {
            resolve();
          },
        );
      });
    });
  }

  function addWidget(content: string, url: string, phaseId: number) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO "experimentsPhaseWidget" (content,"resourceUrl", "experimentPhaseId") VALUES (?,?,?);',
          [content, url, phaseId],
          (t, result) => {
            resolve();
          },
        );
      });
    });
  }

  function fetchWidgets(phaseId: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * from "experimentsPhaseWidget" WHERE "experimentPhaseId" = ?;',
          [phaseId],
          (t, result) => {
            const rows = result.rows;
            const length = rows.length;
            const items = [];
            for (let k = 0; k < length; k++) {
              const item = rows.item(k);
              items.push(item);
            }
            resolve(items);
          },
        );
      });
    });
  }

  function deleteWidget(widgetId: number) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE from "experimentsPhaseWidget" WHERE "id" = ?;',
          [widgetId],
          (t, result) => {
            resolve();
          },
        );
      });
    });
  }
  return {
    experiments,
    addExperiment,
    deleteExperiment,
    fetchPhases,
    addPhase,
    deleteStage,
    addWidget,
    fetchWidgets,
    deleteWidget,
  };
}
