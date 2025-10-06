import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  ZoomIn,
  SlideInRight,
} from 'react-native-reanimated';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    name: 'Tech Conference 2025',
    date: 'October 15, 2025',
    location: 'San Francisco',
    description: 'Annual tech meetup.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    attendees: 1250,
  },
  {
    id: '2',
    name: 'Music Festival',
    date: 'November 5, 2025',
    location: 'New York',
    description: 'Live music and fun.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    attendees: 3500,
  },
  {
    id: '3',
    name: 'Startup Pitch Night',
    date: 'December 10, 2025',
    location: 'Austin',
    description: 'Pitch your ideas.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    attendees: 850,
  },
  {
    id: '4',
    name: 'Food & Wine Expo',
    date: 'January 20, 2026',
    location: 'Los Angeles',
    description: 'Taste the finest cuisine.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    attendees: 2100,
  },
  {
    id: '5',
    name: 'Art Gallery Opening',
    date: 'February 14, 2026',
    location: 'Miami',
    description: 'Contemporary art showcase.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    attendees: 650,
  },
];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const EventListScreen = ({navigation}) => {
  const renderItem = ({item, index}) => (
    <AnimatedTouchableOpacity
      style={styles.card}
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()}
      onPress={() => navigation.navigate('EventDetails', {event: item})}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.imageBackground}
        imageStyle={styles.image}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
          style={styles.overlay}>
          <Animated.View
            entering={FadeInLeft.delay(index * 100 + 200).duration(500)}
            style={styles.contentContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.attendees.toLocaleString()} guests
              </Text>
            </View>
            <Text style={styles.eventName}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.eventDetails}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.icon}>📍</Text>
                <Text style={styles.eventDetails}>{item.location}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </AnimatedTouchableOpacity>
  );

  const ListHeader = () => (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Upcoming Events</Text>
      <Text style={styles.headerSubtitle}>
        {mockEvents.length} amazing events waiting for you
      </Text>
    </Animated.View>
  );

  const ListEmpty = () => (
    <Animated.View
      entering={ZoomIn.duration(500)}
      style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎉</Text>
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>Check back later for updates</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={mockEvents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  imageBackground: {
    width: '100%',
    height: 240,
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  eventName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  eventDetails: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748b',
  },
});

export default EventListScreen;
