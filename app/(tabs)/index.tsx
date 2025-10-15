import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Search, BellDot, ArrowRight } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useProgress } from '@/hooks/useProgress';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import CourseCard from '@/components/courses/CourseCard';
import { featuredCourses, inProgressCourses } from '@/data/courses';

/**
 * @function HomeScreen
 * @description This component renders the home screen of the application.
 * It displays a greeting to the user, a search bar, an overview of the user's progress,
 * and lists of courses to continue learning and featured courses.
 * @returns {JSX.Element} The rendered component.
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const { getOverallProgress } = useProgress();
  const overallProgress = getOverallProgress();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name || 'Aluno'}</Text>
            <Text style={styles.subtitle}>Continue aprendendo</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <BellDot size={24} color={COLORS.darkGray} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/courses')}
        >
          <Search size={20} color={COLORS.gray} />
          <Text style={styles.searchText}>Pesquisar cursos</Text>
        </TouchableOpacity>

        {/* Progress Overview */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.progressContainer}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Seu progresso</Text>
            <Text style={styles.progressPercentage}>{overallProgress}% concluído</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{inProgressCourses.length}</Text>
              <Text style={styles.statLabel}>Em andamento</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{featuredCourses.length}</Text>
              <Text style={styles.statLabel}>Disponíveis</Text>
            </View>
          </View>
        </Animated.View>

        {/* Continue Learning */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue aprendendo</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/courses')}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
              <ArrowRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={inProgressCourses}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.courseList}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 100).duration(400)}>
                <CourseCard course={item} />
              </Animated.View>
            )}
          />
        </View>

        {/* Featured Courses */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cursos em destaque</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/courses')}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
              <ArrowRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredCourses}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.courseList}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 100).duration(400)}>
                <CourseCard course={item} />
              </Animated.View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  greeting: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    marginBottom: SIZES.padding * 1.5,
  },
  searchText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginLeft: SIZES.base,
  },
  progressContainer: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  progressTitle: {
    ...FONTS.h3,
    color: COLORS.darkPrimary,
  },
  progressPercentage: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    marginBottom: SIZES.padding,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h2,
    color: COLORS.darkPrimary,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.darkPrimary,
  },
  sectionContainer: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginRight: SIZES.base / 2,
  },
  courseList: {
    paddingRight: SIZES.padding,
  },
});