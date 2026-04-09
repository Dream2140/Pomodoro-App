import { useNavigate, useParams } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import type { PomodoroSettings } from '@/types';
import { CATEGORIES, CATEGORY_COLORS } from '@/types';
import { formatMinutesToTime } from '@/utils/helpers';
import styles from './Settings.module.css';

const SETTING_LABELS: Record<keyof PomodoroSettings, string> = {
  work: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
  iteration: 'Iterations',
};

const COUNT_OF_CYCLES = 2;

export function Settings() {
  const navigate = useNavigate();
  const { tab = 'pomodoros' } = useParams();
  const { settings, updateSetting, saveSettings } = useSettings();

  const isPomodoros = tab === 'pomodoros';

  function getFirstCycleTime() {
    const { work, shortBreak, longBreak, iteration } = settings;
    return work.value * iteration.value + shortBreak.value * (iteration.value - 1) + longBreak.value;
  }

  function getFullCycleTime() {
    const { work, shortBreak, longBreak, iteration } = settings;
    return (
      (work.value * iteration.value + shortBreak.value * (iteration.value - 1)) * COUNT_OF_CYCLES +
      longBreak.value * (COUNT_OF_CYCLES - 1)
    );
  }

  async function handleSave() {
    await saveSettings();
    navigate('/task-list');
  }

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={isPomodoros}
          className={`${styles.tab} ${isPomodoros ? styles.activeTab : ''}`}
          onClick={() => navigate('/settings/pomodoros')}
        >
          Pomodoros
        </button>
        <button
          role="tab"
          aria-selected={!isPomodoros}
          className={`${styles.tab} ${!isPomodoros ? styles.activeTab : ''}`}
          onClick={() => navigate('/settings/categories')}
        >
          Categories
        </button>
      </div>

      {isPomodoros ? (
        <>
          {/* Settings Controls */}
          <div className={styles.settingsGrid}>
            {(Object.keys(SETTING_LABELS) as (keyof PomodoroSettings)[]).map((key) => {
              const setting = settings[key];
              return (
                <div key={key} className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>{SETTING_LABELS[key]}</span>
                    <span className={styles.settingUnit}>
                      {key === 'iteration' ? 'pomodoros' : 'min'}
                    </span>
                  </div>
                  <div className={styles.settingControl}>
                    <button
                      className={styles.controlBtn}
                      onClick={() => updateSetting(key, setting.value - setting.step)}
                      disabled={setting.value <= setting.min}
                      aria-label={`Decrease ${SETTING_LABELS[key]}`}
                    >
                      &minus;
                    </button>
                    <span className={styles.settingValue} aria-live="polite">
                      {setting.value}
                    </span>
                    <button
                      className={styles.controlBtn}
                      onClick={() => updateSetting(key, setting.value + setting.step)}
                      disabled={setting.value >= setting.max}
                      aria-label={`Increase ${SETTING_LABELS[key]}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cycle Visualization */}
          <div className={styles.cycle}>
            <h3 className={styles.cycleTitle}>Cycle Preview</h3>
            <div className={styles.cycleBar}>
              {Array.from({ length: COUNT_OF_CYCLES }, (_, cycleIdx) => (
                <div key={cycleIdx} className={styles.cycleGroup}>
                  {Array.from({ length: settings.iteration.value }, (_, pomIdx) => (
                    <div key={pomIdx} className={styles.cycleSegment}>
                      <div
                        className={styles.workSegment}
                        style={{ flex: settings.work.value }}
                        title={`Work: ${settings.work.value}m`}
                      />
                      {pomIdx < settings.iteration.value - 1 && (
                        <div
                          className={styles.shortBreakSegment}
                          style={{ flex: settings.shortBreak.value }}
                          title={`Short break: ${settings.shortBreak.value}m`}
                        />
                      )}
                    </div>
                  ))}
                  {cycleIdx < COUNT_OF_CYCLES - 1 && (
                    <div
                      className={styles.longBreakSegment}
                      style={{ flex: settings.longBreak.value }}
                      title={`Long break: ${settings.longBreak.value}m`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.cycleInfo}>
              <span>1st cycle: {formatMinutesToTime(getFirstCycleTime())}</span>
              <span>Full cycle: {formatMinutesToTime(getFullCycleTime())}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save &amp; Go to Tasks
            </button>
            <button className={styles.cancelBtn} onClick={() => navigate('/task-list')}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        /* Categories Tab */
        <div className={styles.categoriesSection}>
          <h3 className={styles.categoriesTitle}>Task Categories</h3>
          <ul className={styles.categoriesList}>
            {CATEGORIES.map((cat) => (
              <li key={cat} className={styles.categoryItem}>
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
                <span className={styles.categoryName}>{cat}</span>
              </li>
            ))}
          </ul>
          <div className={styles.buttons}>
            <button className={styles.saveBtn} onClick={() => navigate('/task-list')}>
              Go to Tasks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
