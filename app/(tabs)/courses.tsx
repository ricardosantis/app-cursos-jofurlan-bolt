import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import CourseCard from '@/components/courses/CourseCard';
import { allCourses } from '@/data/courses';
import Animated, { FadeIn } from 'react-native-reanimated';

const categories = ['Todos', 'Saúde', 'Bem-estar', 'Produtividade', 'Desenvolvimento pessoal'];

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cursos</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar cursos"
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showFilters && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.categoriesContainer}
        >
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.categoryItem, 
                  selectedCategory === item && styles.selectedCategoryItem
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.selectedCategoryText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.coursesList}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.courseCardContainer}>
            <CourseCard course={item} isGrid />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
              }}
            >
              <Text style={styles.resetButtonText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.black,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.black,
    marginLeft: SIZES.base,
    paddingVertical: SIZES.base,
  },
  categoriesContainer: {
    marginBottom: SIZES.padding,
  },
  categoriesList: {
    paddingHorizontal: SIZES.padding,
  },
  categoryItem: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.base,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body4,
    color: COLORS.darkGray,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  coursesList: {
    padding: SIZES.padding,
  },
  courseCardContainer: {
    flex: 1,
    padding: SIZES.base / 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  resetButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
});