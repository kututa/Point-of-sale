import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType } from '../../types/notification';

export function NotificationPreferences() {
  const { preferences, updatePreferences } = useNotifications();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary dark:text-accent-dark">
        Notification Preferences
      </h2>

      <div className="bg-surface rounded-lg shadow-soft p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-primary dark:text-accent-dark mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.enableEmailNotifications}
                onChange={(e) => updatePreferences({
                  enableEmailNotifications: e.target.checked
                })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <span>Enable email notifications</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Low stock threshold
              </label>
              <input
                type="number"
                min="1"
                value={preferences.lowStockThreshold}
                onChange={(e) => updatePreferences({
                  lowStockThreshold: parseInt(e.target.value)
                })}
                className="input-field w-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Summary frequency
              </label>
              <select
                value={preferences.summaryFrequency}
                onChange={(e) => updatePreferences({
                  summaryFrequency: e.target.value as any
                })}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-primary dark:text-accent-dark mb-4">
            Notification Types
          </h3>
          <div className="space-y-4">
            {Object.values(NotificationType).map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.notificationTypes[type]}
                  onChange={(e) => updatePreferences({
                    notificationTypes: {
                      ...preferences.notificationTypes,
                      [type]: e.target.checked
                    }
                  })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}