import {useToast} from 'react-native-toast-notifications';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import {setLastToast} from '../redux/slices/lastToastSlice';
import {useEffect} from 'react';

export const useToastMessage = () => {
  const toast = useToast();
  const lastToast = useSelector((state: RootState) => state.lastToast.value);
  const dispatch = useDispatch();

  const showToast = (content: string, type: string) => {
    if (content !== lastToast) {
      toast.show(content, {
        type: type,
        placement: 'top',
        duration: 4000,
        animationType: 'zoom-in',
        style: {borderRadius: 20},
      });
      dispatch(setLastToast(content));
      setTimeout(() => {
        dispatch(setLastToast(''));
      }, 4000);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setLastToast(''));
    };
  }, [dispatch]);

  return {showToast};
};
