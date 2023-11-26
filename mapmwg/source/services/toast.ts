import Toast from 'react-native-toast-message';

export const showErrorToast = (errorMessage: any) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: errorMessage || 'An unexpected error occurred',
  });
};