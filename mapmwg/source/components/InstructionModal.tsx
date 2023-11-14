import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {primaryColor} from '../constants/color';

interface InstructionProps {
  instruction: string;  
  nextInstruct?: string;
}

const InstructionModal:React.FC<InstructionProps> = ({instruction, nextInstruct}) => {
  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Text>{instruction}</Text>
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
    backgroundColor: primaryColor,
    height: '70%',
    borderRadius: 16,
  },
  nextInstructContainer: {
    height: '30%',
    width: '40%',
    backgroundColor: primaryColor,
  }
});

export default InstructionModal;
