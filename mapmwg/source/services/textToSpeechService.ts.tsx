// TextToSpeechService.ts
import Tts, {Options, AndroidOptions} from 'react-native-tts';

const speakText = (text: string) => {
  const androidParams: AndroidOptions = {
    KEY_PARAM_PAN: 0,
    KEY_PARAM_VOLUME: 1,
    KEY_PARAM_STREAM: 'STREAM_MUSIC', // Thay thế 'STREAM_MUSIC' bằng giá trị phù hợp
  };
  const speakOptions: Options = {
    iosVoiceId: 'your_ios_voice_id', // Cung cấp một ID giọng nói cho iOS, nếu cần
    rate: 0.8, // Tốc độ giọng nói
    androidParams,
  };

  Tts.speak(text, speakOptions);
};

export default speakText;
