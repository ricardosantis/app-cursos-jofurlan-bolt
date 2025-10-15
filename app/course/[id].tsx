import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, BookOpen, Clock, Award } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getCourseById } from '@/lib/data';
import { Course } from '@/types';
import ModuleCard from '@/components/courses/ModuleCard';
import { useProgress } from '@/hooks/useProgress';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const { getCourseProgress } = useProgress();
  const courseProgress = getCourseProgress(parseInt(id || '1'));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await getCourseById(parseInt(id || '1'));
        setCourse(fetchedCourse);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando curso...</Text>
      </SafeAreaView>
    );
  }

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handleContinue = () => {
    const firstIncompleteModule = course.modules.find(
      (module) => !module.completed
    );

    if (firstIncompleteModule) {
      router.push(`/module/${firstIncompleteModule.id}`);
    } else {
      router.push(`/module/${course.modules[0].id}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: course.imageUrl }}
            style={styles.banner}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}
              disabled={downloading}
            >
              <Download size={24} color={COLORS.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.bannerContent}>
            <View style={styles.progressIndicator}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${courseProgress}%` }
                ]} 
              />
            </View>
            <Text style={styles.bannerTitle}>{course.title}</Text>
            <Text style={styles.bannerInstructor}>{course.instructor}</Text>
          </View>
        </View>

        {/* Course Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <BookOpen size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{course.modules.length} módulos</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{course.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={20} color={COLORS.primary} />
              <Text style={styles.statText}>Certificado</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.sectionTitle}>Sobre o curso</Text>
            <Text style={styles.description}>{course.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conteúdo do curso</Text>
              <Text style={styles.moduleCount}>{course.modules.length} módulos</Text>
            </View>
            <FlatList
              data={course.modules}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <ModuleCard 
                  module={item} 
                  index={index} 
                  courseId={course.id} 
                />
              )}
              scrollEnabled={false}
            />
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{courseProgress}% concluído</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${courseProgress}%` }
              ]} 
            />
          </View>
        </View>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          {courseProgress > 0 ? (
            <Text style={styles.continueButtonText}>Continuar</Text>
          ) : (
            <Text style={styles.continueButtonText}>Iniciar curso</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bannerContainer: {
    height: 280,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
  },
  progressIndicator: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: SIZES.base,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  bannerTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SIZES.base / 2,
  },
  bannerInstructor: {
    ...FONTS.body3,
    color: COLORS.white,
    opacity: 0.8,
  },
  detailsContainer: {
    padding: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    marginLeft: SIZES.base / 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    lineHeight: 22,
    marginBottom: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  moduleCount: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  progressText: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    marginBottom: SIZES.base / 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  continueButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
});
