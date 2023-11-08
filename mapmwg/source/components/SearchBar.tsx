// import React from 'react';
// import {View, TextInput, StyleSheet} from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import {tertiaryColor, primaryColor, textColor} from '../constants/color';
// import {SearchProps} from '../props/SearchProps';

// const SearchBar: React.FC<SearchProps> = ({
//   isSearch,
//   setIsSearch,
//   searchText,
//   setSearchText,
//   handleSearchResult,
// }) => {
//   return (
//     <View style={styles.search__bar}>
//       {isSearch ? (
//         <Feather
//           name="search"
//           style={styles.search__bar_icon}
//           size={25}
//           color="black"
//           onPress={exitSearch}
//         />
//       ) : (
//         <Feather
//           name="search"
//           style={styles.search__bar_icon}
//           size={25}
//           color="black"
//         />
//       )}
//       <TextInput
//         style={styles.search__input}
//         placeholder="Search here"
//         onKeyPress={handleSearch}
//         value={searchText}
//         onChangeText={setSearchText}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   search__bar: {
//     width: '80%',
//     height: 50,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: tertiaryColor,
//     backgroundColor: primaryColor,
//     alignSelf: 'center',
//     top: 50,
//     position: 'absolute',
//     color: tertiaryColor,
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   search__bar_icon: {
//     marginLeft: 5,
//     marginRight: 5,
//   },
//   search__input: {
//     flex: 1,
//     color: textColor,
//   },
// });

// export default SearchBar;
