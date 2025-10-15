import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, CheckCircle } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useProgress } from '@/hooks/useProgress';
import { Module } from '@/types';

/**
 * @interface ModuleCardProps
 * @description Defines the props for the ModuleCard component.
 * @property {Module} module - The module data to display.
 * @property {number} index - The index of the module in the course.
 * @property {number} courseId - The ID of the course this module belongs to.
 */
interface ModuleCardProps {
  module: Module;
  index: number;
  courseId: number;
}

/**
 * @function ModuleCard
 * @description A component that displays a module card with its details and progress.
 * @param {ModuleCardProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const ModuleCard = ({ module, index, courseId }: ModuleCardProps) => {
  const { getModuleProgress } = useProgress();
  const progress = getModuleProgress(module.id);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/module/${module.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <View style={styles.indexContainer}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View>
            <Text style={styles.title}>{module.title}</Text>
            <Text style={styles.info}>
              {module.lessons.length} aulas • {module.duration}
            </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          {progress === 100 ? (
            <CheckCircle size={22} color={COLORS.success} />
          ) : (
            <ChevronRight size={22} color={COLORS.primary} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
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
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indexContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  indexText: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.black,
    flex: 1,
  },
  info: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  rightContent: {},
  footer: {
    marginTop: SIZES.base,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default ModuleCard;