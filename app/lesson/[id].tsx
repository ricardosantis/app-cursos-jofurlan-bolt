import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { getLessonById, getNextLesson, getPreviousLesson } from '@/lib/data';
import { Lesson } from '@/types';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { useProgress } from '@/hooks/useProgress';

const { width } = Dimensions.get('window');

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [previousLesson, setPreviousLesson] = useState<Lesson | null>(null);
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { markLessonComplete, isLessonComplete } = useProgress();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonId = parseInt(id || '1');
        const fetchedLesson = await getLessonById(lessonId);
        setLesson(fetchedLesson);

        if (fetchedLesson) {
          setIsCompleted(isLessonComplete(fetchedLesson.id));
          const fetchedNextLesson = await getNextLesson(lessonId);
          setNextLesson(fetchedNextLesson);
          const fetchedPreviousLesson = await getPreviousLesson(lessonId);
          setPreviousLesson(fetchedPreviousLesson);
        }
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      }
    };

    fetchLesson();
  }, [id]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando aula...</Text>
      </SafeAreaView>
    );
  }

  const handleComplete = () => {
    if (!isCompleted && lesson) {
      markLessonComplete(lesson.id);
      setIsCompleted(true);
    }
  };

  const handleVideoComplete = () => {
    handleComplete();
  };

  const handleNavigation = (targetId: number) => {
    router.replace(`/lesson/${targetId}`);
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {/* Download functionality */}}
        >
          <Download size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {lesson.type === 'video' ? (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: lesson.contentUrl || 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={status => {
                setStatus(status);
                if (status.didJustFinish) {
                  handleVideoComplete();
                }
              }}
            />
          </View>
        ) : (
          <View style={styles.textContentContainer}>
            {lesson.contentUrl ? (
              <WebView
                source={{ uri: lesson.contentUrl }}
                style={styles.webview}
              />
            ) : (
              <Text style={styles.textContent}>
                {lesson.content || `Conteúdo em texto da aula "${lesson.title}".`}
              </Text>
            )}
          </View>
        )}

        <View style={styles.lessonDetails}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonInfo}>
            {lesson.type === 'video' ? 'Vídeo' : 'Leitura'} • {lesson.duration}
          </Text>
          <Text style={styles.lessonDescription}>
            {lesson.description || 'Descrição detalhada da aula.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, !previousLesson && styles.disabledButton]}
            onPress={() => previousLesson && handleNavigation(previousLesson.id)}
            disabled={!previousLesson}
          >
            <ChevronLeft size={20} color={previousLesson ? COLORS.primary : COLORS.gray} />
            <Text 
              style={[
                styles.navButtonText, 
                !previousLesson && styles.disabledButtonText
              ]}
            >
              Anterior
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.completeButton, isCompleted && styles.completedButton]}
            onPress={handleComplete}
            disabled={isCompleted}
          >
            <Text style={styles.completeButtonText}>
              {isCompleted ? 'Concluído' : 'Marcar como concluído'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, !nextLesson && styles.disabledButton]}
            onPress={() => nextLesson && handleNavigation(nextLesson.id)}
            disabled={!nextLesson}
          >
            <Text 
              style={[
                styles.navButtonText, 
                !nextLesson && styles.disabledButtonText
              ]}
            >
              Próximo
            </Text>
            <ChevronRight size={20} color={nextLesson ? COLORS.primary : COLORS.gray} />
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SIZES.base,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: SIZES.padding * 2,
  },
  videoContainer: {
    width: width,
    aspectRatio: 16/9,
    backgroundColor: COLORS.black,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  textContentContainer: {
    minHeight: 300,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  webview: {
    width: '100%',
    height: 500,
  },
  textContent: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    lineHeight: 24,
  },
  lessonDetails: {
    padding: SIZES.padding,
  },
  lessonTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  lessonInfo: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  lessonDescription: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: SIZES.padding,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  disabledButtonText: {
    color: COLORS.gray,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  completedButton: {
    backgroundColor: COLORS.success,
  },
  completeButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
});
