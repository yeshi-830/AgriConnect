
import React, { useState } from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  StatusBar,
} from 'react-native';


const translations = {
  en: {
    greeting: 'Good morning, Farmer 👋',
    subtitle: 'Let’s grow something great today.',
    overview: "Today's Overview",
    weather: 'Weather',
    sunny: 'Partly cloudy',
    crops: 'My Crops',
    viewAll: 'View all',
    activities: 'Farm Activities',
    addCrop: '+ Add Crop',
    maize: 'Maize',
    teff: 'Teff',
    wheat: 'Wheat',
    growing: 'Growing',
    planting: 'Planting',
    watering: 'Watering',
    harvesting: 'Harvesting',
    maizeTask: 'Check maize growth',
    teffTask: 'Water the teff field',
    wheatTask: 'Prepare wheat field',
    home: 'Home',
    myCrops: 'My Crops',
    farm: 'Farm',
    profile: 'Profile',
    temperature: 'Temperature',
    humidity: 'Humidity',
    cropMessage: 'Crop management will be available here soon.',
    farmMessage: 'Your farm activities will appear here.',
    profileMessage: 'Your farmer profile will be available here.',
  },
  am: {
    greeting: 'እንደምን አደሩ አርሶ አደር 👋',
    subtitle: 'ዛሬ ጥሩ ምርት እናምርት።',
    overview: 'የዛሬ አጠቃላይ ሁኔታ',
    weather: 'የአየር ሁኔታ',
    sunny: 'በከፊል ደመናማ',
    crops: 'ሰብሎቼ',
    viewAll: 'ሁሉንም ይመልከቱ',
    activities: 'የእርሻ ሥራዎች',
    addCrop: '+ ሰብል ጨምር',
    maize: 'በቆሎ',
    teff: 'ጤፍ',
    wheat: 'ስንዴ',
    growing: 'በማደግ ላይ',
    planting: 'መዝራት',
    watering: 'ማጠጣት',
    harvesting: 'መከር',
    maizeTask: 'የበቆሎ እድገት ይመልከቱ',
    teffTask: 'የጤፍ እርሻ ያጠጡ',
    wheatTask: 'የስንዴ እርሻ ያዘጋጁ',
    home: 'መነሻ',
    myCrops: 'ሰብሎቼ',
    farm: 'እርሻ',
    profile: 'መገለጫ',
    temperature: 'ሙቀት',
    humidity: 'እርጥበት',
    cropMessage: 'የሰብል አስተዳደር በቅርቡ እዚህ ይገኛል።',
    farmMessage: 'የእርሻ ሥራዎችዎ እዚህ ይታያሉ።',
    profileMessage: 'የአርሶ አደር መገለጫዎ እዚህ ይገኛል።',
  },
};

const cropData = [
  { id: '1', icon: '🌽', name: 'maize', status: 'growing', color: '#EAF5DE' },
  { id: '2', icon: '🌾', name: 'teff', status: 'growing', color: '#F8EFD8' },
  { id: '3', icon: '🌱', name: 'wheat', status: 'planting', color: '#E0F1E9' },
];

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [crops, setCrops] = useState(cropData);
const [showAddCrop, setShowAddCrop] = useState(false);
const [newCropName, setNewCropName] = useState('');
const [newCropStage, setNewCropStage] = useState('planting');

  const t = translations[language];

const addNewCrop = () => {
  const name = newCropName.trim();

  if (!name) {
    Alert.alert(
      language === 'en' ? 'Crop name required' : 'የሰብል ስም ያስፈልጋል',
      language === 'en'
        ? 'Please enter a crop name.'
        : 'እባክዎ የሰብል ስም ያስገቡ።'
    );
    return;
  }

  const newCrop = {
    id: Date.now().toString(),
    icon: '🌱',
    name,
    status: newCropStage,
    color: '#E0F1E9',
  };

  setCrops((previousCrops) => [...previousCrops, newCrop]);
  setNewCropName('');
  setNewCropStage('planting');
  setShowAddCrop(false);

  Alert.alert(
    language === 'en' ? 'Success' : 'ተሳክቷል',
    language === 'en'
      ? `${name} added successfully!`
      : `${name} በተሳካ ሁኔታ ታክሏል!`
  );
};
  const toggleTask = (id) => {
    setCompletedTasks((previous) =>
      previous.includes(id)
        ? previous.filter((taskId) => taskId !== id)
        : [...previous, id]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🌿</Text>
        </View>
        <View>
          <Text style={styles.brandName}>AgriConnect</Text>
          <Text style={styles.brandSubtitle}>GROW • CARE • HARVEST</Text>
        </View>
        <Pressable
          style={styles.languageButton}
          onPress={() => setLanguage(language === 'en' ? 'am' : 'en')}
        >
          <Text style={styles.languageText}>
            {language === 'en' ? 'አማ' : 'EN'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.greeting}>{t.greeting}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>
    </View>
  );

  const renderOverview = () => (
    <>
      <Text style={styles.sectionTitle}>{t.overview}</Text>

      <View style={styles.weatherCard}>
        <View style={styles.weatherTop}>
          <View>
            <Text style={styles.weatherLabel}>📍 Ethiopia</Text>
            <Text style={styles.weatherTitle}>{t.weather}</Text>
            <Text style={styles.weatherDescription}>{t.sunny}</Text>
          </View>
          <Text style={styles.weatherIcon}>⛅</Text>
        </View>

        <View style={styles.weatherDivider} />

        <View style={styles.weatherStats}>
          <View>
            <Text style={styles.weatherSmall}>{t.temperature}</Text>
            <Text style={styles.weatherValue}>--°C</Text>
          </View>
          <View>
            <Text style={styles.weatherSmall}>{t.humidity}</Text>
            <Text style={styles.weatherValue}>--%</Text>
          </View>
          <View>
            <Text style={styles.weatherSmall}>Status</Text>
            <Text style={styles.weatherValue}>Demo</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🌱</Text>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>{t.crops}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📋</Text>
          <Text style={styles.statNumber}>
            {3 - completedTasks.length}
          </Text>
          <Text style={styles.statLabel}>{t.activities}</Text>
        </View>
      </View>
    </>
  );

  const renderCrops = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.crops}</Text>
        <Pressable
          onPress={() =>
            Alert.alert(
              t.addCrop,
              'Adding and saving new crops will be our next feature.'
            )
          }
        >
          <Text style={styles.viewAll}>{t.addCrop}</Text>
        </Pressable>
      </View>

      {cropData.map((crop) => (
        <View key={crop.id} style={styles.cropCard}>
          <View
            style={[styles.cropIconBox, { backgroundColor: crop.color }]}
          >
            <Text style={styles.cropIcon}>{crop.icon}</Text>
          </View>
          <View style={styles.cropDetails}>
            <Text style={styles.cropName}>{t[crop.name]}</Text>
            <Text style={styles.cropStatus}>
              {t[crop.status] || crop.status}
            </Text>
          </View>
          <Text style={styles.cropArrow}>›</Text>
        </View>
      ))}
    </>
  );

  const renderActivities = () => {
    const tasks = [
      { id: '1', icon: '🌽', title: t.maizeTask, time: t.growing },
      { id: '2', icon: '💧', title: t.teffTask, time: t.watering },
      { id: '3', icon: '🚜', title: t.wheatTask, time: t.planting },
    ];

    return (
      <>
        <Text style={styles.sectionTitle}>{t.activities}</Text>

        {tasks.map((task) => {
          const isDone = completedTasks.includes(task.id);

          return (
            <Pressable
              key={task.id}
              style={styles.activityCard}
              onPress={() => toggleTask(task.id)}
            >
              <View style={styles.activityIconBox}>
                <Text style={styles.activityIcon}>{task.icon}</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text
                  style={[
                    styles.activityTitle,
                    isDone && styles.completedText,
                  ]}
                >
                  {task.title}
                </Text>
                <Text style={styles.activityTime}>
                  {isDone ? '✓ Completed' : task.time}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  isDone && styles.checkboxDone,
                ]}
              >
                {isDone && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </Pressable>
          );
        })}

        <Text style={styles.helperText}>
          Tap an activity to mark it complete.
        </Text>
      </>
    );
  };

  const renderContent = () => {
    if (activeTab === 'crops') {
      return (
        <View>
          {renderCrops()}
          <Text style={styles.helperText}>{t.cropMessage}</Text>
        </View>
      );
    }

    if (activeTab === 'farm') {
      return (
        <View>
          {renderActivities()}
          <Text style={styles.helperText}>{t.farmMessage}</Text>
        </View>
      );
    }

    if (activeTab === 'profile') {
      return (
        <View style={styles.profileCard}>
          <Text style={styles.profileIcon}>👨‍🌾</Text>
          <Text style={styles.profileTitle}>{t.profile}</Text>
          <Text style={styles.profileText}>{t.profileMessage}</Text>
          <Text style={styles.profileText}>
            AgriConnect • Farmer Edition
          </Text>
        </View>
      );
    }

    return (
      <>
        {renderOverview()}
        {renderCrops()}
        {renderActivities()}
      </>
    );
  };

  const tabs = [
    { id: 'home', icon: '🏠', label: t.home },
    { id: 'crops', icon: '🌱', label: t.myCrops },
    { id: 'farm', icon: '🚜', label: t.farm },
    { id: 'profile', icon: '👤', label: t.profile },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#F5F8F1" />

      {renderHeader()}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}

        <Text style={styles.footer}>
          Made for farmers 🌿
        </Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.navIcon, selected && styles.activeNavText]}>
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  selected && styles.activeNavText,
                ]}
              >
                {tab.label}
              </Text>
              {selected && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8F1',
  },
  header: {
    backgroundColor: '#F5F8F1',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#DCEED6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  logoText: {
    fontSize: 24,
  },
  brandName: {
    color: '#214B32',
    fontSize: 19,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#78917B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  languageButton: {
    marginLeft: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DDE8D8',
  },
  languageText: {
    color: '#245638',
    fontWeight: '800',
    fontSize: 14,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1E3827',
  },
  subtitle: {
    color: '#718174',
    fontSize: 13,
    marginTop: 7,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  sectionTitle: {
    color: '#243A2A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 7,
    marginBottom: 14,
  },
  weatherCard: {
    backgroundColor: '#245C3C',
    borderRadius: 22,
    padding: 19,
    marginBottom: 14,
  },
  weatherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherLabel: {
    color: '#D5E8D7',
    fontSize: 12,
    marginBottom: 8,
  },
  weatherTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  weatherDescription: {
    color: '#D5E8D7',
    fontSize: 13,
    marginTop: 5,
  },
  weatherIcon: {
    fontSize: 48,
  },
  weatherDivider: {
    height: 1,
    backgroundColor: '#568065',
    marginVertical: 17,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherSmall: {
    color: '#D5E8D7',
    fontSize: 11,
    marginBottom: 6,
  },
  weatherValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 23,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E6EDE1',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 9,
  },
  statNumber: {
    color: '#214B32',
    fontSize: 25,
    fontWeight: '800',
  },
  statLabel: {
    color: '#788578',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    color: '#287247',
    fontSize: 12,
    fontWeight: '800',
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E7EDE3',
  },
  cropIconBox: {
    width: 49,
    height: 49,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cropIcon: {
    fontSize: 27,
  },
  cropDetails: {
    flex: 1,
  },
  cropName: {
    color: '#2A3D2D',
    fontSize: 15,
    fontWeight: '800',
  },
  cropStatus: {
    color: '#738276',
    fontSize: 12,
    marginTop: 5,
  },
  cropArrow: {
    color: '#809182',
    fontSize: 27,
    paddingHorizontal: 7,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E7EDE3',
  },
  activityIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#EEF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  activityIcon: {
    fontSize: 22,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: '#2A3D2D',
    fontSize: 13,
    fontWeight: '700',
  },
  activityTime: {
    color: '#718675',
    fontSize: 11,
    marginTop: 5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#849187',
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#C8D7C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#287247',
    borderColor: '#287247',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  helperText: {
    color: '#829082',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 25,
    marginTop: 15,
  },
  profileIcon: {
    fontSize: 55,
    marginBottom: 12,
  },
  profileTitle: {
    color: '#214B32',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 10,
  },
  profileText: {
    color: '#718174',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#94A293',
    fontSize: 11,
    marginTop: 20,
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7EDE3',
    paddingTop: 9,
    paddingBottom: 7,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#879386',
    fontWeight: '600',
  },
  activeNavText: {
    color: '#287247',
    fontWeight: '800',
  },
  activeIndicator: {
    height: 3,
    width: 20,
    borderRadius: 3,
    backgroundColor: '#287247',
    marginTop: 5,
  },
});
