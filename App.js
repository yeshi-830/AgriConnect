
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  crops: '@agriconnect/crops_v1',
  tasks: '@agriconnect/tasks_v1',
};

const COLORS = {
  background: '#F4F7F0',
  white: '#FFFFFF',
  green: '#246342',
  greenDark: '#183F2B',
  greenLight: '#E5F1E2',
  text: '#25372A',
  muted: '#788579',
  border: '#E3EAE0',
  orange: '#E6A33C',
  red: '#C64C4C',
};

const INITIAL_CROPS = [
  { id: '1', icon: '🌽', name: 'Maize', status: 'growing', color: '#EAF5DE' },
  { id: '2', icon: '🌾', name: 'Teff', status: 'growing', color: '#F8EFD8' },
  { id: '3', icon: '🌱', name: 'Wheat', status: 'planting', color: '#E0F1E9' },
];

const INITIAL_TASKS = [
  { id: 'task-1', title: 'Check maize growth', crop: 'Maize', done: false },
  { id: 'task-2', title: 'Water the teff field', crop: 'Teff', done: false },
  { id: 'task-3', title: 'Prepare wheat field', crop: 'Wheat', done: false },
];

const TRANSLATIONS = {
  en: {
    greeting: 'Good morning, Farmer 👋',
    subtitle: "Let's grow something great today.",
    overview: "Today's Overview",
    weather: 'Weather',
    weatherDescription: 'Partly cloudy',
    crops: 'My Crops',
    activities: 'Farm Activities',
    addCrop: 'Add Crop',
    viewAll: 'View all',
    maize: 'Maize',
    teff: 'Teff',
    wheat: 'Wheat',
    growing: 'Growing',
    planting: 'Planting',
    watering: 'Watering',
    harvesting: 'Harvesting',
    home: 'Home',
    myCrops: 'My Crops',
    farm: 'Farm',
    profile: 'Profile',
    temperature: 'Temperature',
    humidity: 'Humidity',
    status: 'Status',
    demo: 'Demo',
    cropSearch: 'Search your crops...',
    noCrops: 'No crops found.',
    noTasks: 'No farm activities yet.',
    cropName: 'Crop name',
    growthStage: 'Growth stage',
    saveCrop: 'Save Crop',
    cancel: 'Cancel',
    addTask: 'Add Task',
    taskName: 'Task description',
    saveTask: 'Save Task',
    remaining: 'Tasks remaining',
    completed: 'Completed',
    pending: 'Pending',
    deleteCrop: 'Delete crop',
    deleteCropConfirm: 'Are you sure you want to delete this crop?',
    deleteTask: 'Delete task',
    deleteTaskConfirm: 'Are you sure you want to delete this task?',
    changeStage: 'Change growth stage',
    cropRequired: 'Crop name required',
    taskRequired: 'Task description required',
    success: 'Success',
    cropAdded: 'Crop added successfully.',
    taskAdded: 'Task added successfully.',
    error: 'Error',
    storageError: 'Could not save your data. Please try again.',
    loading: 'Loading your farm...',
    farmerProfile: 'Farmer Profile',
    farmerEdition: 'AgriConnect • Farmer Edition',
    profileDescription: 'Manage your crops, organize farm activities, and keep track of your growing season.',
    totalCrops: 'Total crops',
    tasksDone: 'Tasks done',
    progress: 'Task progress',
    todayTasks: "Today's tasks",
    tapToComplete: 'Tap an activity to change its status.',
    emptyCropHint: 'Add your first crop to get started.',
    emptyTaskHint: 'Add a task to organize your farm work.',
    remove: 'Delete',
    language: 'Language',
    madeForFarmers: 'Made for farmers 🌿',
  },
  am: {
    greeting: 'እንደምን አደሩ አርሶ አደር 👋',
    subtitle: 'ዛሬ ጥሩ ምርት እናምርት።',
    overview: 'የዛሬ አጠቃላይ ሁኔታ',
    weather: 'የአየር ሁኔታ',
    weatherDescription: 'በከፊል ደመናማ',
    crops: 'ሰብሎቼ',
    activities: 'የእርሻ ሥራዎች',
    addCrop: 'ሰብል ጨምር',
    viewAll: 'ሁሉንም ይመልከቱ',
    maize: 'በቆሎ',
    teff: 'ጤፍ',
    wheat: 'ስንዴ',
    growing: 'በማደግ ላይ',
    planting: 'መዝራት',
    watering: 'ማጠጣት',
    harvesting: 'መከር',
    home: 'መነሻ',
    myCrops: 'ሰብሎቼ',
    farm: 'እርሻ',
    profile: 'መገለጫ',
    temperature: 'ሙቀት',
    humidity: 'እርጥበት',
    status: 'ሁኔታ',
    demo: 'ሙከራ',
    cropSearch: 'ሰብሎችን ይፈልጉ...',
    noCrops: 'ምንም ሰብል አልተገኘም።',
    noTasks: 'እስካሁን የእርሻ ሥራዎች የሉም።',
    cropName: 'የሰብል ስም',
    growthStage: 'የእድገት ደረጃ',
    saveCrop: 'ሰብሉን አስቀምጥ',
    cancel: 'ሰርዝ',
    addTask: 'ሥራ ጨምር',
    taskName: 'የሥራ መግለጫ',
    saveTask: 'ሥራውን አስቀምጥ',
    remaining: 'የቀሩ ሥራዎች',
    completed: 'ተጠናቋል',
    pending: 'በመጠባበቅ ላይ',
    deleteCrop: 'ሰብሉን ሰርዝ',
    deleteCropConfirm: 'ይህን ሰብል ማጥፋት ይፈልጋሉ?',
    deleteTask: 'ሥራውን ሰርዝ',
    deleteTaskConfirm: 'ይህን ሥራ ማጥፋት ይፈልጋሉ?',
    changeStage: 'የእድገት ደረጃ ቀይር',
    cropRequired: 'የሰብል ስም ያስፈልጋል',
    taskRequired: 'የሥራ መግለጫ ያስፈልጋል',
    success: 'ተሳክቷል',
    cropAdded: 'ሰብሉ በተሳካ ሁኔታ ታክሏል።',
    taskAdded: 'ሥራው በተሳካ ሁኔታ ታክሏል።',
    error: 'ስህተት',
    storageError: 'መረጃዎን ማስቀመጥ አልተቻለም። እንደገና ይሞክሩ።',
    loading: 'የእርሻ መረጃዎ በመጫን ላይ ነው...',
    farmerProfile: 'የአርሶ አደር መገለጫ',
    farmerEdition: 'AgriConnect • የአርሶ አደር እትም',
    profileDescription: 'ሰብሎችዎን ያስተዳድሩ፣ የእርሻ ሥራዎችን ያደራጁ፣ እና የእድገት ሁኔታን ይከታተሉ።',
    totalCrops: 'ጠቅላላ ሰብሎች',
    tasksDone: 'የተጠናቀቁ ሥራዎች',
    progress: 'የሥራ ሂደት',
    todayTasks: 'የዛሬ ሥራዎች',
    tapToComplete: 'ሁኔታውን ለመቀየር ሥራውን ይንኩ።',
    emptyCropHint: 'ለመጀመር የመጀመሪያ ሰብልዎን ይጨምሩ።',
    emptyTaskHint: 'የእርሻ ሥራዎን ለማደራጀት ሥራ ይጨምሩ።',
    remove: 'ሰርዝ',
    language: 'ቋንቋ',
    madeForFarmers: 'ለአርሶ አደሮች የተሰራ 🌿',
  },
};

const STAGES = ['planting', 'growing', 'watering', 'harvesting'];
const CROP_COLORS = ['#EAF5DE', '#F8EFD8', '#E0F1E9', '#F8E5D9'];
const CROP_ICONS = ['🌱', '🌽', '🌾', '🥬', '🍅', '🥕'];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);

  const [search, setSearch] = useState('');
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropStage, setNewCropStage] = useState('planting');

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCrop, setNewTaskCrop] = useState('');

  const t = TRANSLATIONS[language];

  // Load saved data once when the app opens.
  useEffect(() => {
    let active = true;

    async function loadSavedData() {
      try {
        const [savedCrops, savedTasks] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.crops),
          AsyncStorage.getItem(STORAGE_KEYS.tasks),
        ]);

        if (!active) return;

        if (savedCrops !== null) {
          const parsed = JSON.parse(savedCrops);
          if (Array.isArray(parsed)) setCrops(parsed);
        }

        if (savedTasks !== null) {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed)) setTasks(parsed);
        }
      } catch (error) {
        console.warn('Could not load AgriConnect data:', error);
        if (active) setStorageError(true);
      } finally {
        if (active) setLoaded(true);
      }
    }

    loadSavedData();

    return () => {
      active = false;
    };
  }, []);

  // Save changes after the initial load so default values cannot overwrite saved data.
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEYS.crops, JSON.stringify(crops)).catch(
      (error) => {
        console.warn('Could not save crops:', error);
        setStorageError(true);
      }
    );
  }, [crops, loaded]);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks)).catch(
      (error) => {
        console.warn('Could not save tasks:', error);
        setStorageError(true);
      }
    );
  }, [tasks, loaded]);

  const filteredCrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return crops;
    return crops.filter((crop) => crop.name.toLowerCase().includes(query));
  }, [crops, search]);

  const completedCount = tasks.filter((task) => task.done).length;
  const remainingCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const getStageLabel = (stage) => t[stage] || stage;

  const openCropStagePicker = (crop) => {
    Alert.alert(
      t.changeStage,
      crop.name,
      [
        ...STAGES.map((stage) => ({
          text: getStageLabel(stage),
          onPress: () => {
            setCrops((previous) =>
              previous.map((item) =>
                item.id === crop.id ? { ...item, status: stage } : item
              )
            );
          },
        })),
        { text: t.cancel, style: 'cancel' },
      ]
    );
  };

  const addCrop = () => {
    const name = newCropName.trim();

    if (!name) {
      Alert.alert(t.cropRequired, language === 'en'
        ? 'Please enter a crop name.'
        : 'እባክዎ የሰብል ስም ያስገቡ።');
      return;
    }

    const duplicate = crops.some(
      (crop) => crop.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      Alert.alert(
        language === 'en' ? 'Crop already exists' : 'ሰብሉ አስቀድሞ አለ',
        language === 'en'
          ? 'A crop with this name is already in your list.'
          : 'ይህ ሰብል በዝርዝርዎ ውስጥ አስቀድሞ አለ።'
      );
      return;
    }

    const newCrop = {
      id: makeId(),
      icon: CROP_ICONS[crops.length % CROP_ICONS.length],
      name,
      status: newCropStage,
      color: CROP_COLORS[crops.length % CROP_COLORS.length],
    };

    setCrops((previous) => [...previous, newCrop]);
    setNewCropName('');
    setNewCropStage('planting');
    setShowAddCrop(false);
    setSearch('');
    Alert.alert(t.success, t.cropAdded);
  };

  const confirmDeleteCrop = (crop) => {
    Alert.alert(t.deleteCrop, `${t.deleteCropConfirm}\n${crop.name}`, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.remove,
        style: 'destructive',
        onPress: () => {
          setCrops((previous) =>
            previous.filter((item) => item.id !== crop.id)
          );
        },
      },
    ]);
  };

  const addTask = () => {
    const title = newTaskName.trim();

    if (!title) {
      Alert.alert(t.taskRequired, language === 'en'
        ? 'Please enter a task description.'
        : 'እባክዎ የሥራ መግለጫ ያስገቡ።');
      return;
    }

    const task = {
      id: makeId(),
      title,
      crop: newTaskCrop || '',
      done: false,
    };

    setTasks((previous) => [...previous, task]);
    setNewTaskName('');
    setNewTaskCrop('');
    setShowAddTask(false);
    Alert.alert(t.success, t.taskAdded);
  };

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const confirmDeleteTask = (task) => {
    Alert.alert(t.deleteTask, `${t.deleteTaskConfirm}\n${task.title}`, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.remove,
        style: 'destructive',
        onPress: () =>
          setTasks((previous) =>
            previous.filter((item) => item.id !== task.id)
          ),
      },
    ]);
  };

  const openAddCrop = () => {
    setNewCropName('');
    setNewCropStage('planting');
    setShowAddCrop(true);
  };

  const openAddTask = () => {
    setNewTaskName('');
    setNewTaskCrop('');
    setShowAddTask(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🌿</Text>
        </View>

        <View style={styles.brandTextWrap}>
          <Text style={styles.brandName}>AgriConnect</Text>
          <Text style={styles.brandSubtitle}>GROW • CARE • HARVEST</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.language}
          style={styles.languageButton}
          onPress={() => setLanguage((current) => current === 'en' ? 'am' : 'en')}
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

  const renderWeather = () => (
    <View style={styles.weatherCard}>
      <View style={styles.weatherTop}>
        <View>
          <Text style={styles.weatherLocation}>📍 Ethiopia</Text>
          <Text style={styles.weatherTitle}>{t.weather}</Text>
          <Text style={styles.weatherDescription}>{t.weatherDescription}</Text>
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
          <Text style={styles.weatherSmall}>{t.status}</Text>
          <Text style={styles.weatherValue}>{t.demo}</Text>
        </View>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={styles.statIconBox}>
          <Text style={styles.statIcon}>🌱</Text>
        </View>
        <Text style={styles.statNumber}>{crops.length}</Text>
        <Text style={styles.statLabel}>{t.totalCrops}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconBox}>
          <Text style={styles.statIcon}>📋</Text>
        </View>
        <Text style={styles.statNumber}>{remainingCount}</Text>
        <Text style={styles.statLabel}>{t.remaining}</Text>
      </View>
    </View>
  );

  const renderSectionHeader = (title, actionLabel, onAction) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={styles.smallAction}
      >
        <Text style={styles.smallActionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );

  const renderCrops = (compact = false) => (
    <View>
      {renderSectionHeader(
        t.crops,
        compact ? t.viewAll : `+ ${t.addCrop}`,
        compact ? () => setActiveTab('crops') : openAddCrop
      )}

      {!compact && (
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t.cropSearch}
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel={t.cropSearch}
        />
      )}

      {filteredCrops.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyText}>
            {crops.length === 0 ? t.emptyCropHint : t.noCrops}
          </Text>
          {crops.length === 0 && (
            <Pressable style={styles.primaryButton} onPress={openAddCrop}>
              <Text style={styles.primaryButtonText}>+ {t.addCrop}</Text>
            </Pressable>
          )}
        </View>
      ) : (
        (compact ? filteredCrops.slice(0, 3) : filteredCrops).map((crop) => (
          <View key={crop.id} style={styles.cropCard}>
            <View style={[styles.cropIconBox, { backgroundColor: crop.color || COLORS.greenLight }]}>
              <Text style={styles.cropIcon}>{crop.icon || '🌱'}</Text>
            </View>

            <View style={styles.cropDetails}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Pressable
                onPress={() => openCropStagePicker(crop)}
                style={styles.stagePill}
                accessibilityRole="button"
                accessibilityLabel={`${t.changeStage}: ${crop.name}`}
              >
                <Text style={styles.cropStatus}>{getStageLabel(crop.status)}</Text>
                <Text style={styles.stageEdit}>⌄</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t.deleteCrop}: ${crop.name}`}
              onPress={() => confirmDeleteCrop(crop)}
              hitSlop={10}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </Pressable>
          </View>
        ))
      )}

      {compact && filteredCrops.length > 3 && (
        <Pressable style={styles.textButton} onPress={() => setActiveTab('crops')}>
          <Text style={styles.textButtonText}>{t.viewAll} ({filteredCrops.length}) →</Text>
        </Pressable>
      )}
    </View>
  );

  const renderTasks = (compact = false) => {
    const shownTasks = compact ? tasks.slice(0, 3) : tasks;

    return (
      <View>
        {renderSectionHeader(
          t.activities,
          compact ? t.viewAll : `+ ${t.addTask}`,
          compact ? () => setActiveTab('farm') : openAddTask
        )}

        {tasks.length > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeading}>
              <Text style={styles.progressLabel}>{t.progress}</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressCaption}>
              {completedCount} {t.completed.toLowerCase()} · {remainingCount} {t.pending.toLowerCase()}
            </Text>
          </View>
        )}

        {shownTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>{t.emptyTaskHint}</Text>
            <Pressable style={styles.primaryButton} onPress={openAddTask}>
              <Text style={styles.primaryButtonText}>+ {t.addTask}</Text>
            </Pressable>
          </View>
        ) : (
          shownTasks.map((task, index) => (
            <View key={task.id} style={styles.activityCard}>
              <Pressable
                style={styles.activityMain}
                onPress={() => toggleTask(task.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.done }}
              >
                <View style={styles.activityIconBox}>
                  <Text style={styles.activityIcon}>
                    {task.done ? '✅' : ['🌽', '💧', '🚜', '🌿'][index % 4]}
                  </Text>
                </View>

                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTitle, task.done && styles.completedText]}>
                    {task.title}
                  </Text>
                  <Text style={styles.activityTime}>
                    {task.done ? `✓ ${t.completed}` : task.crop || t.pending}
                  </Text>
                </View>

                <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                  {task.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </Pressable>

              {!compact && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t.deleteTask}: ${task.title}`}
                  onPress={() => confirmDeleteTask(task)}
                  hitSlop={8}
                  style={styles.taskDelete}
                >
                  <Text style={styles.taskDeleteText}>×</Text>
                </Pressable>
              )}
            </View>
          ))
        )}

        {compact && tasks.length > 3 && (
          <Pressable style={styles.textButton} onPress={() => setActiveTab('farm')}>
            <Text style={styles.textButtonText}>{t.viewAll} ({tasks.length}) →</Text>
          </Pressable>
        )}

        {tasks.length > 0 && (
          <Text style={styles.helperText}>{t.tapToComplete}</Text>
        )}
      </View>
    );
  };

  const renderHome = () => (
    <>
      <Text style={styles.sectionTitle}>{t.overview}</Text>
      {renderWeather()}
      {renderStats()}
      {renderCrops(true)}
      {renderTasks(true)}
    </>
  );

  const renderProfile = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileIcon}>👨‍🌾</Text>
      </View>
      <Text style={styles.profileTitle}>{t.farmerProfile}</Text>
      <Text style={styles.profileSubtitle}>{t.farmerEdition}</Text>
      <Text style={styles.profileText}>{t.profileDescription}</Text>

      <View style={styles.profileStats}>
        <View style={styles.profileStat}>
          <Text style={styles.profileStatNumber}>{crops.length}</Text>
          <Text style={styles.profileStatLabel}>{t.totalCrops}</Text>
        </View>
        <View style={styles.profileStatDivider} />
        <View style={styles.profileStat}>
          <Text style={styles.profileStatNumber}>{completedCount}</Text>
          <Text style={styles.profileStatLabel}>{t.tasksDone}</Text>
        </View>
      </View>

      <Pressable
        style={styles.profileLanguageButton}
        onPress={() => setLanguage((current) => current === 'en' ? 'am' : 'en')}
      >
        <Text style={styles.profileLanguageText}>
          🌐  {t.language}: {language === 'en' ? 'English · አማርኛ' : 'አማርኛ · English'}
        </Text>
      </Pressable>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'crops') return renderCrops(false);
    if (activeTab === 'farm') return renderTasks(false);
    if (activeTab === 'profile') return renderProfile();
    return renderHome();
  };

  const tabs = [
    { id: 'home', icon: '⌂', label: t.home },
    { id: 'crops', icon: '🌱', label: t.myCrops },
    { id: 'farm', icon: '🚜', label: t.farm },
    { id: 'profile', icon: '👤', label: t.profile },
  ];

  const renderCropModal = () => (
    <Modal
      visible={showAddCrop}
      animationType="slide"
      transparent
      onRequestClose={() => setShowAddCrop(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>🌱 {t.addCrop}</Text>
          <Text style={styles.inputLabel}>{t.cropName}</Text>
          <TextInput
            value={newCropName}
            onChangeText={setNewCropName}
            placeholder={t.cropName}
            placeholderTextColor={COLORS.muted}
            style={styles.modalInput}
            autoFocus
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={addCrop}
          />

          <Text style={styles.inputLabel}>{t.growthStage}</Text>
          <View style={styles.stageOptions}>
            {STAGES.map((stage) => (
              <Pressable
                key={stage}
                onPress={() => setNewCropStage(stage)}
                style={[styles.stageOption, newCropStage === stage && styles.stageOptionSelected]}
              >
                <Text style={[styles.stageOptionText, newCropStage === stage && styles.stageOptionTextSelected]}>
                  {getStageLabel(stage)}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={() => setShowAddCrop(false)}>
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={addCrop}>
              <Text style={styles.primaryButtonText}>{t.saveCrop}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderTaskModal = () => (
    <Modal
      visible={showAddTask}
      animationType="slide"
      transparent
      onRequestClose={() => setShowAddTask(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>📋 {t.addTask}</Text>
          <Text style={styles.inputLabel}>{t.taskName}</Text>
          <TextInput
            value={newTaskName}
            onChangeText={setNewTaskName}
            placeholder={t.taskName}
            placeholderTextColor={COLORS.muted}
            style={styles.modalInput}
            autoFocus
            maxLength={120}
            returnKeyType="done"
            onSubmitEditing={addTask}
          />

          {crops.length > 0 && (
            <>
              <Text style={styles.inputLabel}>
                {language === 'en' ? 'Related crop (optional)' : 'ተያያዥ ሰብል (አማራጭ)'}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.stageOptions}>
                  <Pressable
                    onPress={() => setNewTaskCrop('')}
                    style={[styles.stageOption, !newTaskCrop && styles.stageOptionSelected]}
                  >
                    <Text style={[styles.stageOptionText, !newTaskCrop && styles.stageOptionTextSelected]}>
                      {language === 'en' ? 'None' : 'የለም'}
                    </Text>
                  </Pressable>
                  {crops.map((crop) => (
                    <Pressable
                      key={crop.id}
                      onPress={() => setNewTaskCrop(crop.name)}
                      style={[styles.stageOption, newTaskCrop === crop.name && styles.stageOptionSelected]}
                    >
                      <Text style={[styles.stageOptionText, newTaskCrop === crop.name && styles.stageOptionTextSelected]}>
                        {crop.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          <View style={styles.modalActions}>
            <Pressable style={styles.cancelButton} onPress={() => setShowAddTask(false)}>
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={addTask}>
              <Text style={styles.primaryButtonText}>{t.saveTask}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  if (!loaded) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingLogo}>
          <Text style={styles.logoText}>🌿</Text>
        </View>
        <Text style={styles.brandName}>AgriConnect</Text>
        <ActivityIndicator size="large" color={COLORS.green} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>{t.loading}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView
        key={activeTab}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {storageError && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>{t.storageError}</Text>
          </View>
        )}

        {renderContent()}

        <Text style={styles.footer}>{t.madeForFarmers}</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={[styles.navIconWrap, selected && styles.navIconWrapActive]}>
                <Text style={[styles.navIcon, selected && styles.activeNavText]}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[styles.navLabel, selected && styles.activeNavText]}>
                {tab.label}
              </Text>
              {selected && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {renderCropModal()}
      {renderTaskModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingLogo: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loadingSpinner: {
    marginTop: 28,
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
    fontSize: 13,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#DCEED6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  logoText: {
    fontSize: 25,
  },
  brandTextWrap: {
    flex: 1,
  },
  brandName: {
    color: COLORS.greenDark,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: '#78917B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  languageButton: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DDE8D8',
    marginLeft: 8,
  },
  languageText: {
    color: COLORS.green,
    fontWeight: '800',
    fontSize: 14,
  },
  greeting: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1E3827',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
    lineHeight: 19,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 3,
    paddingBottom: 26,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 7,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  weatherCard: {
    backgroundColor: COLORS.green,
    borderRadius: 23,
    padding: 19,
    marginBottom: 15,
    overflow: 'hidden',
  },
  weatherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherLocation: {
    color: '#D5E8D7',
    fontSize: 12,
    marginBottom: 8,
  },
  weatherTitle: {
    color: COLORS.white,
    fontSize: 21,
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
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 23,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 21,
  },
  statNumber: {
    color: COLORS.greenDark,
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  smallAction: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  smallActionText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '800',
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 13,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cropIconBox: {
    width: 49,
    height: 49,
    borderRadius: 15,
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
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  stagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F0F5ED',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
  cropStatus: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
  },
  stageEdit: {
    color: COLORS.green,
    fontSize: 13,
    marginLeft: 5,
  },
  deleteButton: {
    width: 33,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F0',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: COLORS.red,
    fontSize: 23,
    lineHeight: 26,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  progressHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
  },
  progressPercent: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#EAF0E6',
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#4D9A61',
  },
  progressCaption: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 9,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconBox: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#EEF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  activityIcon: {
    fontSize: 21,
  },
  activityDetails: {
    flex: 1,
    paddingRight: 6,
  },
  activityTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  activityTime: {
    color: COLORS.muted,
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
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  taskDelete: {
    marginLeft: 8,
    width: 29,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDeleteText: {
    color: COLORS.red,
    fontSize: 22,
  },
  helperText: {
    color: '#829082',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 18,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 23,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  emptyIcon: {
    fontSize: 31,
    marginBottom: 9,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 13,
  },
  primaryButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.muted,
    fontWeight: '700',
    fontSize: 12,
  },
  textButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 17,
  },
  textButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 23,
    alignItems: 'center',
    padding: 23,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileAvatar: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileIcon: {
    fontSize: 48,
  },
  profileTitle: {
    color: COLORS.greenDark,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  profileSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 6,
  },
  profileText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 15,
    marginBottom: 18,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8F2',
    borderRadius: 15,
    width: '100%',
    paddingVertical: 16,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNumber: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: '800',
  },
  profileStatLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  profileStatDivider: {
    width: 1,
    height: 38,
    backgroundColor: COLORS.border,
  },
  profileLanguageButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '100%',
    alignItems: 'center',
  },
  profileLanguageText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '700',
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
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 6 : 8,
    paddingHorizontal: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  navIconWrap: {
    minWidth: 45,
    minHeight: 29,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  navIconWrapActive: {
    backgroundColor: COLORS.greenLight,
  },
  navIcon: {
    fontSize: 20,
    color: '#879386',
  },
  navLabel: {
    fontSize: 10,
    color: '#879386',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeNavText: {
    color: COLORS.green,
    fontWeight: '800',
  },
  activeIndicator: {
    height: 3,
    width: 19,
    borderRadius: 3,
    backgroundColor: COLORS.green,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 35, 20, 0.42)',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    paddingBottom: Platform.OS === 'ios' ? 32 : 23,
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#DCE4D8',
    alignSelf: 'center',
    marginBottom: 19,
  },
  modalTitle: {
    color: COLORS.greenDark,
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 21,
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: '#F6F8F4',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 18,
  },
  stageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    marginTop: 4,
  },
  stageOption: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  stageOptionSelected: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  stageOptionText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  stageOptionTextSelected: {
    color: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 2,
  },
  warningBanner: {
    backgroundColor: '#FFF3D8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  warningText: {
    color: '#785519',
    fontSize: 12,
    lineHeight: 18,
  },
});
