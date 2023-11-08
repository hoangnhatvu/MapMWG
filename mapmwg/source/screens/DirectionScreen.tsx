import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface DirectionScreenProps {
  handleBack?: () => void;
}

const DirectionScreen: React.FC<DirectionScreenProps> = ({handleBack}) => {
  return (
    <View
      style={{
        width: '100%',
        height: '20%',
        backgroundColor: 'white',
        position: 'absolute',
      }}>
      <View
        style={{
          flexDirection: 'column',
          height: '22%',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            marginLeft: 10,
          }}>
          <FontAwesome6
            name="arrow-left"
            size={25}
            style={{marginRight: 10}}
            onPress={handleBack}
          />
          <FontAwesome6
            name="circle-dot"
            style={{marginLeft: 10, color: 'blue'}}
          />
          <TextInput style={styles.input_text} placeholder="Vị trí của bạn" />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
          <FontAwesome6
            name="location-dot"
            size={20}
            style={{marginLeft: 40, color: 'red'}}
          />
          <TextInput
            style={[styles.input_text, {marginLeft: 12}]}
            placeholder="Chọn điểm đến"
          />
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <FontAwesome6 name="car" size={20} style={{marginRight: 10}} />
          <FontAwesome6 name="motorcycle" size={20} style={{marginRight: 10}} />
          <FontAwesome6 name="truck-fast" size={20} style={{marginRight: 10}} />
          <FontAwesome6
            name="person-walking"
            size={25}
            style={{marginRight: 10}}
          />
        </View>
      </View>
    </View>
  );
};

export default DirectionScreen;

const styles = StyleSheet.create({
  input_text: {
    height: 40,
    width: '65%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 15,
    marginVertical: 5,
  },
});
