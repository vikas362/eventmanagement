import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../ReusableComponant/Header';

// Create animated components
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const EventDetailsScreen = ({route, navigation}) => {
  const {event} = route.params;

  // Animation shared values
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  // Handle button press animations
  const onPressIn = () => {
    buttonScale.value = withSpring(0.96, {damping: 15});
    buttonOpacity.value = withTiming(0.8, {duration: 150});
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1, {damping: 15});
    buttonOpacity.value = withTiming(1, {duration: 150});
  };

  // Animated styles for button
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={{uri: event.image}}
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
          style={styles.overlay}>
          <Header title="" />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Event Title Section */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(100)}
              style={styles.titleSection}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>Featured Event</Text>
              </View>
              <Text style={styles.title}>{event.name}</Text>
            </Animated.View>

            {/* Info Cards */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(200)}
              style={styles.infoContainer}>
              {/* Date Card */}
              <View style={styles.infoCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📅</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{event.date}</Text>
                </View>
              </View>

              {/* Location Card */}
              <View style={styles.infoCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📍</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.location}</Text>
                </View>
              </View>

              {/* Attendees Card */}
              <View style={styles.infoCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👥</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Expected Guests</Text>
                  <Text style={styles.infoValue}>
                    {event.attendees?.toLocaleString() || '500+'} people
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Description Section */}
            <Animated.View
              entering={SlideInRight.duration(600).delay(400)}
              style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.description}>{event.description}</Text>

              {/* Additional Info */}
              <View style={styles.highlightBox}>
                <Text style={styles.highlightIcon}>✨</Text>
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightTitle}>Special Features</Text>
                  <Text style={styles.highlightText}>
                    Networking opportunities, live entertainment, and exclusive
                    access to industry leaders
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Spacer for button */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Fixed Button at Bottom */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(600)}
            style={styles.buttonWrapper}>
            <AnimatedTouchable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => navigation.navigate('GuestList', {event: event})}
              style={[styles.button, buttonAnimatedStyle]}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}>
                <Text style={styles.buttonText}>View Guest List</Text>
                <Text style={styles.buttonIcon}>→</Text>
              </LinearGradient>
            </AnimatedTouchable>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Extra space for button
  },
  titleSection: {
    marginBottom: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  infoContainer: {
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
  },
  descriptionSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  highlightBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  highlightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20, // Reduced since we added padding to scrollContent
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 32, // Increased bottom padding
    // paddingTop: 20,

    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    height: 50,
    // paddingTop: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    height: 50,

    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 18,
    // paddingTop: 5,
    // paddingHorizontal: 32,/
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default EventDetailsScreen;
