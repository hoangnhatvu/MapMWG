import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';
import HTML from 'react-native-render-html';
import {removeHTMLTags} from '../utils/removeHTMLTag';

interface InstructionProps {
  instruction: string;
  nextInstruct?: string;
}

Tts.setDefaultLanguage('vi-VN');

const InstructionModal: React.FC<InstructionProps> = ({instruction}) => {
  const [instructIcon, setInstructIcon] = useState('arrow-up-outline');

  useEffect(() => {
    const speak = () => {
      Tts.speak(removeHTMLTags(instruction));
    };
    speak();

    const timeoutId = setTimeout(() => {
      speak();
    }, 40000);

    return () => clearTimeout(timeoutId);
  }, [instruction]);

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
        <View style={{alignSelf: 'center', marginHorizontal: 32, flex: 1}}>
          <Ionicons name={instructIcon} size={32} color={'white'} />
        </View>
        <View style={{alignSelf: 'center', marginRight: 16, flex: 3}}>
          <HTML
            source={{html: instruction}}
            tagsStyles={{
              b: {
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24',
              },
            }}
            baseStyle={styles.instructionText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: '15%',
    opacity: 0.95,
  },
  instructionContainer: {
    backgroundColor: 'forestgreen',
    borderRadius: 16,
    flexDirection: 'row',
  },
  instructionText: {
    marginLeft: -26,
    marginVertical: 20,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default InstructionModal;
