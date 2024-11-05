import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../models/enums/language.enum';

interface AppSettings {
  dataSaver: boolean;
  nfswEnabled: boolean;
  theme: 'light' | 'dark';
  language: Language
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'manga-world-settings';

  private defaultSettings: AppSettings = {
    dataSaver: false,
    nfswEnabled: false,
    theme: 'light',
    language : Language.EN
  }    

  private settingsSubject = new BehaviorSubject<AppSettings>(
    this.loadSettings()
  );

  settings$ = this.settingsSubject.asObservable();

  constructor() {
    if(!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveSettings(this.defaultSettings);
    }      
  }

  private loadSettings(): AppSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.defaultSettings;
  }

  private saveSettings(settings: AppSettings) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  updateSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.saveSettings(newSettings);
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }
}
