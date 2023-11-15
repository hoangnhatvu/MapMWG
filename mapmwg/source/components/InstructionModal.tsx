import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, textColor} from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InstructionProps {
  instruction: string;
  nextInstruct?: string;
}

const InstructionModal: React.FC<InstructionProps> = ({instruction}) => {
  const [instructIcon, setInstructIcon] = useState('arrow-up-outline');

  useEffect(() => {
    // Kiểm tra xem instruction có chứa từ "Trái" không và đặt icon tương ứng
    if (instruction.toLowerCase().includes('trái')) {
      setInstructIcon('arrow-back-outline');
    } else if (instruction.toLowerCase().includes('phải')) {
      setInstructIcon('arrow-forward-outline');
    } else {
      // Nếu không có "Trái" hoặc "Phải", sử dụng icon mặc định
      setInstructIcon('arrow-up-outline');
    }
  }, [instruction]);

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <View style={{alignSelf:'center', marginHorizontal: 32}}>
          <Ionicons name={instructIcon} size={32} color={textColor} />
        </View>
        <View style={{alignSelf: 'center', marginRight: 16}}>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: '20%',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: '15%',
  },
  instructionContainer: {
    backgroundColor: "#00ffff",
    height: '70%',
    borderRadius: 16,
    flexDirection: 'row',
    borderColor: tertiaryColor,
    borderWidth: 1,
  },
  nextInstructContainer: {
    height: '30%',
    width: '40%',
    backgroundColor: secondaryColor,
  },
  instructionText: {
    color: textColor,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default InstructionModal;
