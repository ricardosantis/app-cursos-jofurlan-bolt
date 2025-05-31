import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { PlayCircle, BookOpen } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useProgress } from '@/hooks/useProgress';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  isGrid?: boolean;
}

const CourseCard = ({ course, isGrid = false }: CourseCardProps) => {
  const { getCourseProgress } = useProgress();
  const progress = getCourseProgress(course.id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isGrid ? styles.gridCard : styles.horizontalCard
      ]}
      onPress={() => router.push(`/course/${course.id}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: course.imageUrl }}
        style={[
          styles.image,
          isGrid ? styles.gridImage : styles.horizontalImage
        ]}
        resizeMode="cover"
      />

      <View 
        style={[
          styles.content,
          isGrid ? styles.gridContent : styles.horizontalContent
        ]}
      >
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{course.category}</Text>
        </View>

        <Text 
          style={[
            styles.title,
            isGrid ? styles.gridTitle : styles.horizontalTitle
          ]}
          numberOfLines={2}
        >
          {course.title}
        </Text>

        <Text 
          style={styles.instructor}
          numberOfLines={1}
        >
          {course.instructor}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <BookOpen size={14} color={COLORS.gray} />
            <Text style={styles.statText}>{course.modules.length} módulos</Text>
          </View>
          <View style={styles.stat}>
            <PlayCircle size={14} color={COLORS.gray} />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalCard: {
    width: 280,
    marginRight: SIZES.padding,
  },
  gridCard: {
    flex: 1,
    margin: SIZES.base / 2,
  },
  image: {
    backgroundColor: COLORS.lightGray,
  },
  horizontalImage: {
    width: '100%',
    height: 150,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: SIZES.padding,
  },
  horizontalContent: {
    height: 180,
  },
  gridContent: {
    height: 160,
  },
  categoryContainer: {
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius / 2,
    alignSelf: 'flex-start',
    marginBottom: SIZES.base / 2,
  },
  category: {
    ...FONTS.body5,
    color: COLORS.primary,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  horizontalTitle: {
    fontSize: 18,
  },
  gridTitle: {
    fontSize: 16,
  },
  instructor: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  statText: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginRight: SIZES.base,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    ...FONTS.body5,
    color: COLORS.darkGray,
    width: 30,
  },
});

export default CourseCard;