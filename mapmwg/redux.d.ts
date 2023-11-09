import store from './source/redux/store';
type RootState = ReturnType<typeof store.getState>;

export default RootState;