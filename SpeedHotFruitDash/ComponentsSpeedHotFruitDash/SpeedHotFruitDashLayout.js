import { ImageBackground, Platform, ScrollView } from 'react-native';

const SpeedHotFruitDashLayout = ({ children }) => {
  return (
    <ImageBackground
      source={
        Platform.OS === 'ios'
          ? require('../../assets/images/fruitdashbg.png')
          : require('../../assets/images/andrbg.png')
      }
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default SpeedHotFruitDashLayout;
