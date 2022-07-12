/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Easing from 'react-native/Libraries/Animated/Easing';

const directions = {
  left: 'LEFT',
  right: 'RIGHT',
};

const widthScreen = Dimensions.get('window').width - 50;
let timerMoving = null;

const App = () => {
  const [isJump, setIsJump] = useState(false);
  const [direction, setDirection] = useState(directions.right);
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  const [translateXTrump, setTranslateTrump] = useState(new Animated.Value(0));
  const [translateX, setTranslateX] = useState(0);
  const [isMoving, setMoving] = useState(false);
  const [pointsMario, setPointsMario] = useState(0);
  const [pointsTrump, setPointsTrump] = useState(0);
  const [time, setTime] = useState(200);

  const objMeteoro = useRef(null);
  const objPopo = useRef(null);
  const objMario = useRef(null);

  const LIMIT_POINTS = 6;

  const buttons = [
    {
      name: 'md-arrow-back',
      onPressIn: 'moveLeft()',
      onPressOut: 'onPressOut()',
      style: 'rowkey',
      size: 20,
    },
    {
      name: 'aperture-sharp',
      onPress: 'shoot()',
      style: 'rowkey',
      size: 29,
      color: 'red',
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
    const interval = setInterval(() => {
      setTime(value => value - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(objMario);
    objMario.current.measure( (fx, fy, width, height, px, py) => {
      console.log('Component width is: ' + width)
      console.log('Component height is: ' + height)
      console.log('X offset to page: ' + px)
      console.log('Y offset to page: ' + py)
    })
  }, [])

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
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
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
  const shoot = async () => {
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
        timerMoving = setTimeout(moveRight, MOVING_TIME);
        break;
      case directions.left:
        timerMoving = setTimeout(moveLeft, MOVING_TIME);
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
  });

  const onPressOut = () => {
    setTimeout(() => {
      setMoving(false);
      clearTimeout(timerMoving);
    }, 10);
  };

  const detectarMario = async () => {
    const dataMario = {};
    const dataPopo = {};

    await objMario.current.measure((fx, fy, width, height, px, py) => {
      dataMario['width'] = width;
      dataMario['height'] = height;
      dataMario['px'] = px;
      dataMario['py'] = py;

      detectChoque(dataMario, dataPopo);
    });
    await objPopo.current.measure((fx, fy, width, height, px, py) => {
      dataPopo['width'] = width;
      dataPopo['height'] = height;
      dataPopo['px'] = px;
      dataPopo['py'] = py;

      detectChoque(dataMario, dataPopo);
    });
  };

  const detectChoque = (data1, data2) => {
    if (
      data1.px < data2.px + data2.width &&
      data1.px + data1.width > data2.px &&
      data1.py < data2.py + data2.height &&
      data1.py + data1.height > data2.py
    ) {
      console.log('Parce lo tocaste');
      return true;
    }
  };

  const Box = ({title, value, time}) => {
    return (
      <View style={styles.topbox}>
        <Text style={styles.topboxVal}>{title}</Text>
        <Text style={time && value <= 10 ? [styles.topboxVal, {color: 'red'}] : styles.topboxVal}>{value}</Text>
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
          ref={objMario}
          onLayout={event => {
            detectarMario(event);
          }}
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
          ref={objMario}
          onLayout={event => {
            detectarMario(event);
          }}
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
          <Box title="MARIO" value={pointsMario} />
          <Box title="TRUMPY" value={pointsTrump} />
          <Box title="TIME" value={time} time={true} />
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
        <Animated.Image
          ref={objPopo}
          style={{
            ...styles.popo,
            transform: [
              {translateX: translateXTrump},
              ...styles.trumpCharacter.transform,
            ],
          }}
          source={require('./app/assets/images/popo.png')}
        />
        {/* <Animated.Image
          // eslint-disable-next-line react-native/no-inline-styles
          ref={objMeteoro}
          style={{
            ...styles.marioCharacter,
            width: 55,
            height: 40,
            resizeMode: 'contain',
            position: 'absolute',
            bottom: 60,
            transform: [{translateX: translateX - 5}, {rotate: '230deg'}],
          }}
          source={require('./app/assets/images/meteorito.png')}
        /> */}
        {renderCharacter()}
      </View>
      <View style={styles.grass} />
      <View style={styles.floor}>
        <Image
          source={require('./app/assets/images/dino.png')}
          style={styles.dino}
        />
        <Image
          source={require('./app/assets/images/tesoro.png')}
          style={styles.tesoro}
        />
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
            <Ionicons
              size={button.size}
              name={button.name}
              color={button.color || 'black'}
            />
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
    zIndex: 100,
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
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
    position: 'absolute',
    top: 90,
    resizeMode: 'center',
    width: 150,
    height: 200,
    transform: [{rotateX: '180deg'}],
  },
  popo: {
    position: 'absolute',
    top: 140,
    resizeMode: 'contain',
    width: 50,
    height: 200,
    transform: [{rotateX: '180deg'}],
  },
  dino: {
    position: 'absolute',
    zIndex: -1,
    width: 150,
    left: 190,
    resizeMode: 'contain',
    transform: [{rotateX: '160deg'}],
  },
  tesoro: {
    position: 'absolute',
    zIndex: 1,
    width: 90,
    height: 90,
    resizeMode: 'contain',
    left: 0,
    bottom: 0,
    transform: [{rotate: '-30deg'}],
  },
});

export default App;
