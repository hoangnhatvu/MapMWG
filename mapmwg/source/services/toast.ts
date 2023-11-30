import Toast from 'react-native-toast-message';

export const showErrorToast = (error: string) => {
  Toast.show({
    type: 'error',
    text1: 'Lỗi',
    text2: error,
    position: 'top',
    topOffset: 20,
  });
}