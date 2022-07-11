/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Easing from 'react-native/Libraries/Animated/Easing';

const directions = {
  left: 'LEFT',
  right: 'RIGHT',
};

const widthScreen = Dimensions.get('window').width - 50;
let timer = null;

const App = () => {
  const [isJump, setIsJump] = useState(false);
  const [direction, setDirection] = useState(directions.right);
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  const [translateXTrump, setTranslateTrump] = useState(new Animated.Value(0));
  const [translateX, setTranslateX] = useState(0);
  const [isMoving, setMoving] = useState(false);

  const buttons = [
    {
      name: 'md-arrow-back',
      onPressIn: 'moveLeft()',
      onPressOut: 'onPressOut()',
      style: 'rowkey',
      size: 20,
    },
    {
      name: 'md-arrow-up',
      onPress: 'jump()',
      style: 'rowkey',
      size: 20,
    },
    {
      name: 'md-arrow-forward',
      onPressIn: 'moveRight()',
      onPressOut: 'onPressOut()',
      style: 'rowkey',
      size: 20,
    },
  ];

  useEffect(() => {
    if (isMoving) {
      movingCharacter(direction);
    }
  }, [direction, isMoving, movingCharacter, translateX]);

  useEffect(() => {
    if (isJump) {
      startJumping(-50);
    }
  }, [isJump, startJumping]);

  useEffect(() => {
    animateTrump();
  }, [animateTrump]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animateTrump = useCallback(() => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(translateXTrump, {
        toValue: Math.floor(Math.random() * (widthScreen - 30) + 10),
        duration: 2000,
      }),
    ]).start(() => {
      animateTrump();
    });
  });

  const moveLeft = () => {
    setMoving(true);
    setDirection(directions.left);
    if (translateX > 0) {
      setTranslateX(direc => direc - 5);
    }
  };
  const jump = async () => {
    setIsJump(true);
  };
  const moveRight = () => {
    setMoving(true);
    setDirection(directions.right);
    if (translateX < widthScreen) {
      setTranslateX(direc => direc + 5);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const movingCharacter = useCallback((isDirection = directions.right) => {
    const MOVING_TIME = 30;
    switch (isDirection) {
      case directions.right:
        timer = setTimeout(moveRight, MOVING_TIME);
        break;
      case directions.left:
        timer = setTimeout(moveLeft, MOVING_TIME);
        break;

      default:
        break;
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startJumping = useCallback(toValue => {
    const avacedX = direction === directions.right ? 30 : -30;
    setTranslateY(toValue);
    if (translateX < widthScreen && translateX >= 0) {
      setTranslateX(x => x + avacedX);
    }
    setTimeout(() => {
      setTranslateY(-92);
      setIsJump(false);
      if (translateX < widthScreen && translateX >= 0) {
        setTranslateX(x => x + (avacedX - 5));
      }
    }, 200);

    // Animated.timing(translateY, {
    //   toValue,
    //   duration: 300,
    //   easing: Easing.linear,
    //   useNativeDriver: true,
    // }).stop(() => {
    //   setIsJump(false);
    //   setTranslateY(-92);
    // });
  });

  const onPressOut = () => {
    setTimeout(() => {
      setMoving(false);
      clearTimeout(timer);
    }, 10);
  };

  const Box = ({title, value}) => {
    return (
      <View style={styles.topbox}>
        <Text style={styles.topboxVal}>{title}</Text>
        <Text style={styles.topboxVal}>{value}</Text>
      </View>
    );
  };

  const renderCharacter = () => {
    const rotateY = direction === directions.left ? '180deg' : '0deg';
    if (isJump) {
      return (
        <Animated.Image
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.marioCharacter,
            width: 55,
            resizeMode: 'contain',
            position: 'absolute',
            bottom: -92,
            transform: [{translateX}, {translateY}, {rotateY}],
          }}
          source={require('./app/assets/gifs/mario-jumping.gif')}
        />
      );
    } else if (isMoving) {
      return (
        <Animated.Image
          style={{
            ...styles.marioCharacter,
            transform: [{translateX: translateX - 5}, {rotateY}],
          }}
          source={require('./app/assets/gifs/mario-moving.gif')}
        />
      );
    } else {
      return (
        <Animated.Image
          style={{
            ...styles.marioCharacter,
            transform: [{translateX: translateX + 2}, {rotateY}],
          }}
          source={require('./app/assets/images/mario.png')}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sky}>
        <View style={styles.toptext}>
          <Box title="MARIO" value="0" />
          <Box title="TRUMPY" value="1" />
          {/* <Box title="TIME" value="9999" /> */}
        </View>
        <Animated.Image
          style={{
            ...styles.trumpCharacter,
            transform: [
              {translateX: translateXTrump},
              ...styles.trumpCharacter.transform,
            ],
          }}
          source={require('./app/assets/images/trump.png')}
        />
        {renderCharacter()}
      </View>
      <View style={styles.grass} />
      <View style={styles.floor}>
        {buttons.map((button, i) => (
          <TouchableOpacity
            key={i}
            onPress={
              button.onPress
                ? () => {
                    // eslint-disable-next-line no-eval
                    eval(button.onPress);
                  }
                : null
            }
            onPressIn={
              button.onPressIn
                ? () => {
                    // eslint-disable-next-line no-eval
                    eval(button.onPressIn);
                  }
                : null
            }
            onPressOut={
              button.onPressOut
                ? () => {
                    // eslint-disable-next-line no-eval
                    eval(button.onPressOut);
                  }
                : null
            }
            style={styles.rowkey}>
            <Ionicons size={button.size} name={button.name} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sky: {
    flex: 4,
    backgroundColor: '#049cd8',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  grass: {
    height: 10,
    backgroundColor: '#43b047',
    width: '100%',
  },
  floor: {
    flex: 1,
    backgroundColor: '#4f311c',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowkey: {
    backgroundColor: '#cacaca',
    padding: 20,
    borderRadius: 10,
  },
  toptext: {
    position: 'absolute',
    top: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  topbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topboxVal: {
    marginTop: 3,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  marioCharacter: {
    // position: 'absolute',
  },
  trumpCharacter: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 90,
    resizeMode: 'center',
    width: 150,
    height: 200,
    transform: [{rotateX: '180deg'}],
  },
});

export default App;
