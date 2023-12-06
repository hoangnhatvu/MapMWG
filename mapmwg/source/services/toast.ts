import {useToast} from 'react-native-toast-notifications';

export const useToastMessage = () => {
  const toast = useToast();

  const showToast = (content: string, type: string) => {
    toast.show(content, {
      type: type,
      placement: 'top',
      duration: 4000,
      animationType: 'zoom-in',
      style: {borderRadius: 20},
    });
  };

  return {showToast};
};
