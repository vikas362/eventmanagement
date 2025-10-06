import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthConstants} from '../../../Redux';
import {displayErrorToast} from '../../../Helpers/Utils';
import {strings} from '../../../Localization/Localization';
import Header from '../../../ReusableComponant/Header';

// Mock API to simulate fetching guest data
const mockAPI = {
  guests: [],

  initialize() {
    if (this.guests.length === 0) {
      const names = [
        'John',
        'Jane',
        'Michael',
        'Sarah',
        'David',
        'Emily',
        'Chris',
        'Lisa',
        'Robert',
        'Anna',
      ];
      const surnames = [
        'Smith',
        'Johnson',
        'Williams',
        'Brown',
        'Jones',
        'Garcia',
        'Miller',
        'Davis',
        'Rodriguez',
        'Martinez',
      ];

      for (let i = 1; i <= 10000; i++) {
        this.guests.push({
          id: i,
          name: `${names[Math.floor(Math.random() * names.length)]} ${
            surnames[Math.floor(Math.random() * surnames.length)]
          }`,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          ticket_type: Math.random() > 0.7 ? 'VIP' : 'Regular',
          created_at: new Date(
            2024,
            0,
            1 + Math.floor(Math.random() * 300),
          ).toISOString(),
          is_checked_in: Math.random() > 0.6,
        });
      }
    }
  },

  async fetchGuests(page = 1, limit = 50, filters = {}) {
    // Ensure initialization happens
    this.initialize();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...this.guests];

    // Apply filters only if they have values
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchLower),
      );
    }

    if (filters.gender && filters.gender !== null) {
      filtered = filtered.filter(g => g.gender === filters.gender);
    }

    if (filters.ticket_type && filters.ticket_type !== null) {
      filtered = filtered.filter(g => g.ticket_type === filters.ticket_type);
    }

    if (filters.is_checked_in !== undefined && filters.is_checked_in !== null) {
      filtered = filtered.filter(
        g => g.is_checked_in === filters.is_checked_in,
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    console.log('Fetch Debug:', {
      page,
      limit,
      start,
      end,
      totalGuests: this.guests.length,
      filteredCount: filtered.length,
      returnedCount: paginatedData.length,
    });

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },
};

/**
 * GuestItem Component
 *
 * Renders a single guest card with avatar, name, gender, ticket type, and check-in status
 *
 * @param {Object} guest - Guest data object containing id, name, gender, ticket_type, etc.
 * @returns {JSX.Element} Guest card component
 */
const GuestItem = ({guest}) => {
  /**
   * Generates initials from guest's full name
   *
   * @param {string} name - Full name of the guest
   * @returns {string} Uppercase initials (e.g., "John Doe" → "JD")
   */
  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const avatarBg = guest.gender === 'Male' ? '#3b82f6' : '#ec4899';

  return (
    <View style={styles.guestItem}>
      <View style={[styles.avatar, {backgroundColor: avatarBg}]}>
        <Text style={styles.avatarText}>{getInitials(guest.name)}</Text>
      </View>

      <View style={styles.guestInfo}>
        <Text style={styles.guestName}>{guest.name}</Text>
        <View style={styles.guestMeta}>
          <Text style={styles.metaText}>{guest.gender}</Text>
          <View style={styles.separator} />
          <View
            style={[
              styles.ticketBadge,
              guest.ticket_type === 'VIP'
                ? styles.vipBadge
                : styles.regularBadge,
            ]}>
            <Text
              style={[
                styles.ticketText,
                guest.ticket_type === 'VIP'
                  ? styles.vipText
                  : styles.regularText,
              ]}>
              {guest.ticket_type}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.checkInBadge,
          guest.is_checked_in ? styles.checkedIn : styles.notCheckedIn,
        ]}>
        <Text
          style={[
            styles.checkInText,
            guest.is_checked_in
              ? styles.checkInTextGreen
              : styles.checkInTextRed,
          ]}>
          {guest.is_checked_in ? '✓ In' : 'Out'}
        </Text>
      </View>
    </View>
  );
};

/**
 * GuestList Component
 *
 * Main component that displays a paginated, searchable, and filterable list of event guests.
 * Features include:
 * - Infinite scroll pagination (50 guests per page)
 * - Real-time search with debouncing
 * - Multiple filters (gender, ticket type, check-in status)
 * - Pull-to-refresh functionality
 * - Loading states and empty state handling
 * - Logout functionality
 *
 * @param {Object} navigation - React Navigation object
 * @param {Object} route - Route params containing event data
 * @returns {JSX.Element} Guest list screen component
 */
export default function GuestList({navigation, route}) {
  const dispatch = useDispatch();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalGuests, setTotalGuests] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: null,
    ticket_type: null,
    is_checked_in: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Memoized active filters object
   * Combines search query with other filter values
   */
  const activeFilters = useMemo(
    () => ({
      search: debouncedSearch,
      ...filters,
    }),
    [debouncedSearch, filters],
  );

  /**
   * Fetches guest data from the mock API with pagination and filters
   *
   * @param {number} pageNum - Page number to fetch (1-based)
   * @param {boolean} isRefresh - Whether this is a pull-to-refresh action
   */
  const fetchGuests = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (loading || (!hasMore && pageNum > 1)) return;

      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      try {
        const result = await mockAPI.fetchGuests(pageNum, 50, activeFilters);

        if (isRefresh || pageNum === 1) {
          setGuests(result.data);
        } else {
          setGuests(prev => [...prev, ...result.data]);
        }

        setTotalGuests(result.total);
        setHasMore(pageNum < result.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.error('Error fetching guests:', error);
        Alert.alert('Error', 'Failed to fetch guests. Please try again.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [loading, hasMore, activeFilters],
  );

  /**
   * Initial data load on component mount
   * Fetches first page of guests
   */
  useEffect(() => {
    fetchGuests(1, false);
  }, []);

  /**
   * Reloads guest list when filters change
   * Resets pagination and fetches from first page
   */
  useEffect(() => {
    setGuests([]);
    setPage(1);
    setHasMore(true);
    fetchGuests(1, false);
  }, [activeFilters]);

  /**
   * Handles loading more guests when user scrolls to bottom
   * Triggers pagination to fetch next page
   */
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchGuests(page + 1);
    }
  };

  /**
   * Handles pull-to-refresh action
   * Resets list and fetches fresh data from first page
   */
  const handleRefresh = () => {
    setGuests([]);
    setPage(1);
    setHasMore(true);
    fetchGuests(1, true);
  };

  /**
   * Toggles a filter value on/off
   * If the filter is already active, it deactivates it; otherwise activates it
   *
   * @param {string} type - Filter type ('gender', 'ticket_type', 'is_checked_in')
   * @param {any} value - Value to set for the filter
   */
  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  /**
   * Clears all active filters and search query
   * Resets the list to show all guests
   */
  const clearAllFilters = () => {
    setFilters({
      gender: null,
      ticket_type: null,
      is_checked_in: null,
    });
    setSearchQuery('');
  };

  /**
   * Handles user logout
   * Shows confirmation dialog before dispatching logout action
   */
  const logOut = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch({type: AuthConstants.RESET_STATE});
            displayErrorToast(strings?.logout || 'Logged out');
          },
        },
      ],
      {cancelable: true},
    );
  }, [dispatch]);

  /**
   * Calculates the number of active filters
   * Includes search query and all filter values
   */
  const activeFilterCount =
    Object.values(filters).filter(v => v !== null).length +
    (debouncedSearch ? 1 : 0);

  /**
   * Renders loading indicator at the bottom of the list
   * Shows when fetching more pages
   *
   * @returns {JSX.Element|null} Loading indicator or null
   */
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  /**
   * Renders empty state when no guests match the filters
   * Shows option to clear filters if any are active
   *
   * @returns {JSX.Element|null} Empty state component or null
   */
  const renderEmpty = () => {
    if (loading || initialLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No guests found</Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity
            onPress={clearAllFilters}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={route?.params?.event.name} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Guest List</Text>
          <Text style={styles.subtitle}>
            {totalGuests.toLocaleString()} guests
          </Text>
        </View>
        <TouchableOpacity onPress={logOut} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>
            {strings?.logout || 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search guests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilterCount > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}>
          <Text
            style={[
              styles.filterButtonText,
              activeFilterCount > 0 && styles.filterButtonTextActive,
            ]}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Gender</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.gender === 'Male' && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('gender', 'Male')}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.gender === 'Male' && styles.filterChipTextActive,
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.gender === 'Female' && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('gender', 'Female')}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.gender === 'Female' && styles.filterChipTextActive,
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ticket Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.ticket_type === 'VIP' && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('ticket_type', 'VIP')}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.ticket_type === 'VIP' &&
                      styles.filterChipTextActive,
                  ]}>
                  VIP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.ticket_type === 'Regular' && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('ticket_type', 'Regular')}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.ticket_type === 'Regular' &&
                      styles.filterChipTextActive,
                  ]}>
                  Regular
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Check-in Status</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.is_checked_in === true && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('is_checked_in', true)}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.is_checked_in === true &&
                      styles.filterChipTextActive,
                  ]}>
                  Checked In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.is_checked_in === false && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter('is_checked_in', false)}>
                <Text
                  style={[
                    styles.filterChipText,
                    filters.is_checked_in === false &&
                      styles.filterChipTextActive,
                  ]}>
                  Not Checked In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeFilterCount > 0 && (
            <TouchableOpacity
              onPress={clearAllFilters}
              style={styles.clearAllButton}>
              <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={guests}
        renderItem={({item}) => <GuestItem guest={item} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filtersPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  clearAllButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  clearAllButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  guestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
  },
  ticketBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipBadge: {
    backgroundColor: '#fef3c7',
  },
  regularBadge: {
    backgroundColor: '#e0e7ff',
  },
  ticketText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vipText: {
    color: '#92400e',
  },
  regularText: {
    color: '#3730a3',
  },
  checkInBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  checkedIn: {
    backgroundColor: '#d1fae5',
  },
  notCheckedIn: {
    backgroundColor: '#fee2e2',
  },
  checkInText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkInTextGreen: {
    color: '#065f46',
  },
  checkInTextRed: {
    color: '#991b1b',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
