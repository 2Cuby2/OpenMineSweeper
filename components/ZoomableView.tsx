import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type ZoomableViewProps = {
  children: React.JSX.Element | React.JSX.Element[] | null;
  maxZoom?: number;
  containerStyle?: StyleProp<ViewStyle>;
  containerChildrenStyle?: StyleProp<ViewStyle>;
};
const ZoomableView = ({
  children,
  maxZoom = 2,
  containerStyle,
  containerChildrenStyle,
}: ZoomableViewProps) => {
  const animatedRef = useAnimatedRef<Animated.View>();

  const initialContainerViewSize = useSharedValue({ width: 0, height: 0 });
  const postInitContainerViewSize = useSharedValue({ width: 0, height: 0 });
  const initialContainerChildrenViewSize = useSharedValue({ width: 0, height: 0 });

  const initialZoom = useSharedValue(1);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Update initialZoom when initialContainerViewSize and initialContainerChildrenViewSize are set
  useAnimatedReaction(() => {
    if (initialContainerChildrenViewSize.value.width !== 0) {
      return Math.min(
        initialContainerViewSize.value.width / initialContainerChildrenViewSize.value.width,
        initialContainerViewSize.value.height / initialContainerChildrenViewSize.value.height,
      )
    }
    return 1;
  }, (currentValue: number) => {
    initialZoom.value = currentValue;
    scale.value = currentValue;
    savedScale.value = currentValue;

    // Update postInitContainerViewSize, this will be used to calculate translation accurately by taking into account initialZoom
    const measurement = measure(animatedRef);
    const { width, height } = measurement ?? { width: 0, height: 0 };
    postInitContainerViewSize.value = { width, height };
  });

  // pinchGesture is used to zoom in and zoom out
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = clamp(
        savedScale.value * event.scale,
        initialZoom.value,
        maxZoom,
      );
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const translationX = useSharedValue(0);
  const savedTranslationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);

  // panGesture is used to navigate in the zoomed view
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((event) => {
      const measurement = measure(animatedRef);
      const { width, height } = measurement ?? { width: 0, height: 0 };

      const maxTranslateX = (
        (width - postInitContainerViewSize.value.width) / 2
        * (initialContainerViewSize.value.width / width)
        * (initialContainerViewSize.value.width / postInitContainerViewSize.value.width)
      );
      const maxTranslateY = (
        (height - postInitContainerViewSize.value.height) / 2
        * (initialContainerViewSize.value.height / height)
        * (initialContainerViewSize.value.height / postInitContainerViewSize.value.height)
      );

      translationX.value = clamp(
        savedTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translationY.value = clamp(
        savedTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .onEnd(() => {
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
      <Animated.View
        style={[animatedStyle, containerStyle, { width: '100%', height: '100%' }]}
        ref={animatedRef}
        onLayout={({ nativeEvent }) => {
          const { width, height } = nativeEvent.layout;
          initialContainerViewSize.value = { width, height };
        }}
      >
        <View
          style={containerChildrenStyle}
          onLayout={({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            initialContainerChildrenViewSize.value = { width, height };
          }}
        >
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
export default ZoomableView;
