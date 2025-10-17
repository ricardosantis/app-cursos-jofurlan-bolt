import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Play, FileText, Lock } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { api } from '@/lib/api';
import { Module } from '@/types';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useProgress } from '@/hooks/useProgress';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const { isLessonComplete } = useProgress();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const fetchedModule = await api.modules.getById(parseInt(id || '1'));
        setModule(fetchedModule);
      } catch (error) {
        console.error('Failed to fetch module:', error);
      }
    };

    fetchModule();
  }, [id]);

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando módulo...</Text>
      </SafeAreaView>
    );
  }

  const renderLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={20} color={COLORS.white} />;
      case 'text':
        return <FileText size={20} color={COLORS.white} />;
      default:
        return <Play size={20} color={COLORS.white} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Módulo {module.order}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDuration}>{module.lessons.length} aulas • {module.duration}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{module.description}</Text>
        </View>

        <View style={styles.lessonsContainer}>
          <Text style={styles.lessonsTitle}>Aulas do módulo</Text>
          
          {module.lessons.map((lesson, index) => {
            const isCompleted = isLessonComplete(lesson.id);
            const isLocked = lesson.locked;

            return (
              <Animated.View 
                key={lesson.id}
                entering={FadeInRight.delay(index * 100).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.lessonCard,
                    isCompleted && styles.completedLessonCard,
                    isLocked && styles.lockedLessonCard,
                  ]}
                  onPress={() => {
                    if (!isLocked) {
                      router.push(`/lesson/${lesson.id}`);
                    }
                  }}
                  disabled={isLocked}
                >
                  <View style={styles.lessonLeft}>
                    <View 
                      style={[
                        styles.lessonIconContainer,
                        isCompleted && styles.completedIconContainer,
                        isLocked && styles.lockedIconContainer,
                      ]}
                    >
                      {isLocked ? (
                        <Lock size={20} color={COLORS.gray} />
                      ) : isCompleted ? (
                        <CheckCircle size={20} color={COLORS.white} />
                      ) : (
                        renderLessonIcon(lesson.type)
                      )}
                    </View>
                    <View style={styles.lessonDetails}>
                      <Text 
                        style={[
                          styles.lessonTitle,
                          isCompleted && styles.completedLessonText,
                          isLocked && styles.lockedLessonText,
                        ]}
                      >
                        {lesson.title}
                      </Text>
                      <Text 
                        style={[
                          styles.lessonInfo,
                          isCompleted && styles.completedLessonInfo,
                          isLocked && styles.lockedLessonInfo,
                        ]}
                      >
                        {lesson.type === 'video' ? 'Vídeo' : 'Leitura'} • {lesson.duration}
                      </Text>
                    </View>
                  </View>
                  
                  {isLocked ? (
                    <Lock size={18} color={COLORS.gray} />
                  ) : isCompleted ? (
                    <CheckCircle size={18} color={COLORS.success} />
                  ) : (
                    <View style={styles.lessonStatus} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => {
            const firstIncompleteLesson = module.lessons.find(
              (lesson) => !isLessonComplete(lesson.id) && !lesson.locked
            );
            
            if (firstIncompleteLesson) {
              router.push(`/lesson/${firstIncompleteLesson.id}`);
            } else {
              router.push(`/lesson/${module.lessons[0].id}`);
            }
          }}
        >
          <Text style={styles.continueButtonText}>Continuar módulo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  content: {
    padding: SIZES.padding,
  },
  titleContainer: {
    marginBottom: SIZES.padding,
  },
  moduleTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  moduleDuration: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
  descriptionContainer: {
    marginBottom: SIZES.padding,
  },
  descriptionText: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  lessonsContainer: {
    marginBottom: SIZES.padding * 2,
  },
  lessonsTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  completedLessonCard: {
    borderColor: COLORS.lightSuccess,
    backgroundColor: COLORS.lightSuccess,
  },
  lockedLessonCard: {
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  completedIconContainer: {
    backgroundColor: COLORS.success,
  },
  lockedIconContainer: {
    backgroundColor: COLORS.lightGray,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: 2,
  },
  lessonInfo: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  completedLessonText: {
    color: COLORS.darkSuccess,
  },
  completedLessonInfo: {
    color: COLORS.success,
  },
  lockedLessonText: {
    color: COLORS.gray,
  },
  lockedLessonInfo: {
    color: COLORS.gray,
  },
  lessonStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: SIZES.padding,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  continueButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
});
