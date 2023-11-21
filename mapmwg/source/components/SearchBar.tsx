import {StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect} from 'react';
import {primaryColor, tertiaryColor, textColor} from '../constants/color';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import Feather from 'react-native-vector-icons/Feather';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {useState} from 'react';

const SearchBar = () => {
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchKey, setSearchKey] = useState<string>('');
  const dispatch = useDispatch();

  const exitSearch = () => {
    dispatch(setIsSearch(false));
    dispatch(setSearchText(''));
  };

  useEffect(() => {
    if (searchKey !== '') {
      dispatch(setIsSearch(true));
      dispatch(setSearchText(searchKey));
    } else {
      dispatch(setIsSearch(false));
    }
  }, [searchKey]);

  return (
    <View style={styles.search__bar}>
      {isSearch ? (
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
        onChangeText={value => {
          dispatch(setSearchText(value));
          setSearchKey(value);
          dispatch(setIsSearch(!!value)); // Set isSearch to true if there is a value, otherwise false
        }}
        value={isSearch ? searchKey : searchText}
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
