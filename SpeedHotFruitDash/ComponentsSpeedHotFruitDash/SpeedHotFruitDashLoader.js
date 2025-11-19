import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import SpeedHotFruitDashLayout from './SpeedHotFruitDashLayout';

const SpeedHotFruitDashLoader = () => {
  return (
    <SpeedHotFruitDashLayout>
      <View style={styles.fruitdashloaderwrap}>
        {Platform.OS === 'ios' ? (
          <Image
            source={require('../../assets/images/fruitdashload.png')}
            style={{ bottom: 60 }}
          />
        ) : (
          <Image
            source={require('../../assets/images/andricon.png')}
            style={{
              borderRadius: 50,
              width: 350,
              height: 350,
              bottom: 60,
            }}
          />
        )}
      </View>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitdashloaderwrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 770,
  },
});

export default SpeedHotFruitDashLoader;
