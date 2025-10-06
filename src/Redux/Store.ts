import {applyMiddleware, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {thunk} from 'redux-thunk';
import rootReducer from './RootReducer';

// const store;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(persistedReducer);
const store = createStore(rootReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};
