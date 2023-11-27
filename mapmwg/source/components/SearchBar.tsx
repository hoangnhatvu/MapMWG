import {StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {primaryColor, tertiaryColor, textColor} from '../constants/color';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import Feather from 'react-native-vector-icons/Feather';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {useState} from 'react';
import {setIsSearchDirect} from '../redux/slices/isSearchDirectSlice';
import {setIsDirected} from '../redux/slices/isDirectedSlide';

const SearchBar = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchDirect = useSelector(
    (state: RootState) => state.isSearchDirect.value,
  );
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchKey, setSearchKey] = useState<string>('');
  const textInputRef = useRef<any>(null);
  const dispatch = useDispatch();

  const exitSearch = () => {
    dispatch(setIsSearch(false));
    {isSearchDirect && dispatch(setIsDirected(true))};
    dispatch(setIsSearchDirect(false));
    dispatch(setSearchText(''));
    textInputRef.current.blur();
  };

  const pressSearchInput = () => {
    if (!isSearch) {
      dispatch(setSearchText(''));
      setSearchKey('');
      dispatch(setIsSearch(true));
    }
  };

  useEffect(() => {
    dispatch(setSearchText(searchKey));
  }, [searchKey]);

  useEffect(() => {
    if (isSearchDirect && !isFocus) {
      textInputRef.current.focus();
      setIsFocus(true);
    }
  }, []);

  return (
    <View style={styles.search__bar}>
      {isSearch || isSearchDirect ? (
        <Feather
          name="arrow-left"
          style={styles.search__bar_icon}
          size={25}
          color="black"
          onPress={exitSearch}
        />
      ) : (
        <Feather
          name="search"
          style={styles.search__bar_icon}
          size={25}
          color="black"
        />
      )}
      <TextInput
        style={styles.search__input}
        placeholder="Search here"
        ref={textInputRef}
        onPressIn={() => {
          dispatch(setSearchText(''));
          setSearchKey('');
          dispatch(setIsSearch(true));
        }}
        onChangeText={value => {
          dispatch(setSearchText(value));
          setSearchKey(value);
        }}
        value={isSearch || isSearchDirect ? searchKey : searchText}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search__bar: {
    width: '90%',
    height: 40,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: primaryColor,
    alignSelf: 'center',
    top: 50,
    position: 'absolute',
    color: tertiaryColor,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  search__bar_icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  search__input: {
    flex: 1,
    color: textColor,
  },
});
