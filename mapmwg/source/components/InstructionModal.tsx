import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, textColor} from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from "react-native-tts";

interface InstructionProps {
  instruction: string;
  nextInstruct?: string;
}

Tts.setDefaultLanguage('vi-VN');

const InstructionModal: React.FC<InstructionProps> = ({instruction}) => {
  const [instructIcon, setInstructIcon] = useState('arrow-up-outline');

  useEffect(() => {
    const speak = () => {
      Tts.speak(instruction);
    };
    speak();

    const timeoutId = setTimeout(() => {
      speak();
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [instruction])

  useEffect(() => {
    if (instruction.toLowerCase().includes('trái')) {
      setInstructIcon('arrow-back-outline');
    } else if (instruction.toLowerCase().includes('phải')) {
      setInstructIcon('arrow-forward-outline');
    } else {
      setInstructIcon('arrow-up-outline');
    }
  }, [instruction]);

  

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <View style={{alignSelf:'center', marginHorizontal: 32}}>
          <Ionicons name={instructIcon} size={32} color={'white'} />
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
    backgroundColor: "forestgreen",
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});

export default InstructionModal;
