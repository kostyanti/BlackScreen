import { Component, ViewChild, ElementRef, HostListener, OnInit, AfterViewInit, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsPanel } from './SettingsPanel';
import { defaultSkipKey, SkipKey } from './SkipKey';
import { defaultSettings, Settings } from './Settings';
import { StorageUtil } from '../StorageUtil';
import Hls from 'hls.js';

declare global {
  interface Window {
    __onGCastApiAvailable: (isAvailable: boolean) => void;
    cast: any;
    chrome: any;
  }
}

@Component({
  selector: 'app-player',
  imports: [
    SliderComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './player.component.html',
  styleUrls: [
    './player.component.scss',
    './playerB.component.scss',
    './playerC.component.scss'
  ]
})
export class PlayerComponent implements AfterViewInit {
  //#region fields
  private static readonly SETTINGS_KEY = 'settings-key';
  private static readonly PLAYER_VOLUME_KEY = 'player-volume';

  videoUrl: string = 'https://p78.kodik.info/s/m/Ly9jbG91ZC5rb2Rpay1zdG9yYWdlLmNvbS91c2VydXBsb2Fkcy9kMzZkM2FlMS1lYmQzLTQ4MDAtYmFmMi01OTcyZDVhNzY5MDU/f5d0647cfc6e5e3441299b67645e1390786845d318683a9051cf31fc42c1821c:2025082910/720.mp4:hls:manifest.m3u8';

  @ViewChild('videoEl', { static: true }) videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('mainColorPicker') mainColorPicker!: ElementRef<HTMLInputElement>; 
  @ViewChild('secondColorPicker') secondColorPicker!: ElementRef<HTMLInputElement>;
  @ViewChild('playerWrapper', { static: true }) playerWrapper!: ElementRef;

  SettingsPanel = SettingsPanel;

  settingsVisible: boolean = false;
  qualitySettingsVisible: boolean = false;
  speedSettingsVisible: boolean = false;
  timerSettingsVisible: boolean = false;
  colorSettingsVisible: boolean = false;
  hotKeysSettingsVisible: boolean = false;
  skipKeysSettingsVisible: boolean = false;
  changeSkipKeysSettingsVisible: boolean = false;
  
  FullScreen: boolean = false;
  controlsVisible: boolean = true;
  inactivityTimeout: any;
  isPlaying: boolean = false;
  isHovered: boolean = false;
  timerIsOn: boolean = false;
  
  settings: Settings = defaultSettings;
 
  currentSoundValue: number = 0;
  currentPlayerValue: number = 0;
  currentPlayerLabel: string = '00:00';
  videoDuration: number = 0;
  videoDurationLabel: string = '00:00';
  selectedSkipKey: number = 0;
  
  scrollPosition = { x: 0, y: 0 };

  currentSkipSegment: boolean = false;
  skipTimer: any = null;
  skipProgress: number = 0;
  skipDuration = 5000;
  activeSkipKey: SkipKey = defaultSkipKey;
  ignoreSkipKey: SkipKey[] = [];
  //#endregion

  constructor(
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit() {
    const video = this.videoEl.nativeElement;

    if (Hls.isSupported() && this.videoUrl) {
      const hls = new Hls();
      hls.loadSource(this.videoUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoUrl;
      video.addEventListener('loadedmetadata', () => video.play());
    }

    video.addEventListener('timeupdate', () => {
      this.ngZone.run(() => {
        this.currentPlayerValue = video.currentTime;
        this.currentPlayerLabel = this.formatTime(Math.floor(video.currentTime));
      });
    });

    video.addEventListener('loadedmetadata', () => {
      this.ngZone.run(() => {
        this.videoDuration = video.duration;
        this.videoDurationLabel = this.formatTime(Math.floor(video.duration));
      });
    });

    this.ngZone.runOutsideAngular(() => {
      const volume = StorageUtil.load<number>(PlayerComponent.PLAYER_VOLUME_KEY, 0);
      setTimeout(() => {
        this.ngZone.run(() => this.setVolume(volume));
      });
    });

    document.addEventListener('click', (e) => {
      const panel = document.querySelector('.all-settings');
      const button = document.querySelector('.player-button-settings');
      
      if (!panel?.contains(e.target as Node) && !button?.contains(e.target as Node)) {
        this.closeAllSetings();
      }
    });

    this.loadSettings();
    
    return;

    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable) {
        this.initializeCast();
      }
    };
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    }
    return [m, s].map(v => String(v).padStart(2, '0')).join(':');
  }

  startInactivityTimer() {
    if (!this.isPlaying) return;
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.controlsVisible = false;
      }
    }, 3000);
  }

  toggleControlTimer(flag: boolean) {
    this.controlsVisible = true;
    this.timerIsOn = flag;

    if (flag) this.startInactivityTimer();
    else clearTimeout(this.inactivityTimeout);
  }

  resetControls() {
    if (!this.timerIsOn) return;
    this.controlsVisible = true;
    this.startInactivityTimer();
  }

  onMouseEnter() { this.isHovered = true; }

  onMouseLeave() { this.isHovered = false; }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (!this.playerWrapper) return;
    if (!this.playerWrapper.nativeElement.contains(event.target)) return;
    this.resetControls();
  }

  async togglePiP() {
    const video = this.videoEl.nativeElement;

    if (!document.pictureInPictureEnabled) {
      alert('Picture-in-Picture не підтримується вашим браузером');
      return;
    }

    try {
      if (video !== document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (err) {
      console.error('Помилка при включенні PiP:', err);
    }
  }

  togglePlay() {
    const video = this.videoEl.nativeElement;
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      video.play();
      this.toggleControlTimer(true);
    } else {
      video.pause();
      this.toggleControlTimer(false);
    }
  }

  toggleFullscreen() {
    const player = document.querySelector('.player') as HTMLElement;

    if (!document.fullscreenElement) {
      this.scrollPosition = { x: window.scrollX, y: window.scrollY };
      this.FullScreen = true;

      if (player.requestFullscreen) { player.requestFullscreen(); } 
      else if ((player as any).webkitRequestFullscreen) { (player as any).webkitRequestFullscreen(); } 
      else if ((player as any).msRequestFullscreen) { (player as any).msRequestFullscreen(); }

    } else {
      const restoreScroll = () => {
        window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
        this.FullScreen = false;

        document.removeEventListener('fullscreenchange', restoreScroll);
      };

      document.addEventListener('fullscreenchange', restoreScroll);

      if (document.exitFullscreen) { document.exitFullscreen(); } 
      else if ((document as any).webkitExitFullscreen) { (document as any).webkitExitFullscreen(); } 
      else if ((document as any).msExitFullscreen) { (document as any).msExitFullscreen(); }
    }
  }

  initializeCast() {
    const context = window.cast.framework.CastContext.getInstance();
    context.setOptions({
      receiverApplicationId: 'YOUR_CUSTOM_APP_ID',
      autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
  }

  startCasting() {

  }

  casting(url: string, base: string, season: string, episode: string) {
    const context = window.cast.framework.CastContext.getInstance();
    context.requestSession()
      .then(() => {
        const session = context.getCurrentSession();
        const message = {
          url: url,
          base: base,
          season: season,
          episode: episode
        };
        session.sendMessage('urn:x-cast:com.example.custom', message)
          .then(() => console.log('Message sent'))
          .catch((err: any) => console.error('Error sending message', err));
      });
  }

  toggleSettings(panel: SettingsPanel) {
    this.toggleControlTimer(false);
    switch(panel) {
      case SettingsPanel.Main:
        this.settingsVisible = !this.settingsVisible;
        if (!this.settingsVisible) this.closeAllSetings();
        break;
      case SettingsPanel.Quality:
        this.qualitySettingsVisible = !this.qualitySettingsVisible;
        break;
      case SettingsPanel.Speed:
        this.speedSettingsVisible = !this.speedSettingsVisible;
        break;
      case SettingsPanel.Timer:
        if (this.settings.AutoPlay) this.timerSettingsVisible = !this.timerSettingsVisible;
        else this.timerSettingsVisible = false;
        break;
      case SettingsPanel.Color:
        this.colorSettingsVisible = !this.colorSettingsVisible;
        break;
      case SettingsPanel.HotKeys:
        this.hotKeysSettingsVisible = !this.hotKeysSettingsVisible;
        break;
      case SettingsPanel.SkipKeys:
        if (this.settings.SkipKeys) this.skipKeysSettingsVisible = !this.skipKeysSettingsVisible;
        else this.skipKeysSettingsVisible = false;
        break;
      case SettingsPanel.ChangeSkipKeys:
        this.changeSkipKeysSettingsVisible = !this.changeSkipKeysSettingsVisible;
        break;
    }
  }

  closeAllSetings() {
    this.settingsVisible = false;
    this.qualitySettingsVisible = false;
    this.speedSettingsVisible = false;
    this.timerSettingsVisible = false;
    this.colorSettingsVisible = false;
    this.hotKeysSettingsVisible = false;
    this.skipKeysSettingsVisible = false;
    this.changeSkipKeysSettingsVisible = false;
    if (this.isPlaying) this.toggleControlTimer(true);
  }

  addSkipKey() {
    this.settings.skipKeys.push({ ...defaultSkipKey });
    this.saveSettings();
  }

  selectKey(id: number) {
    if (this.selectedSkipKey != id) {
      this.changeSkipKeysSettingsVisible = true;
      this.selectedSkipKey = id;
    }
    else this.toggleSettings(SettingsPanel.ChangeSkipKeys);
  }

  removeSkipKey(index: number, event?: MouseEvent) {
    event?.stopPropagation();
    this.changeSkipKeysSettingsVisible = false;
    this.settings.skipKeys.splice(index, 1);
    this.saveSettings();
  }

  saveSettings() {
    StorageUtil.save<Settings>(PlayerComponent.SETTINGS_KEY, this.settings);
  }

  loadSettings() {
    const loaded = StorageUtil.load<Settings>(PlayerComponent.SETTINGS_KEY, defaultSettings);
    this.settings = loaded;
    this.applyColors();
  }

  applyColors() {
    document.documentElement.style.setProperty('--player-main-color', this.settings.playerMainColor);
    document.documentElement.style.setProperty('--player-second-color-r', this.settings.playerSecondColorR.toString());
    document.documentElement.style.setProperty('--player-second-color-g', this.settings.playerSecondColorG.toString());
    document.documentElement.style.setProperty('--player-second-color-b', this.settings.playerSecondColorB.toString());
  }

  setMainColor(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    this.settings.playerMainColor = input.value;
    this.applyColors();
    this.saveSettings();
  }

  setSecondColor(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    const hexColor = input.value;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    this.settings.playerSecondColorR = r;
    this.settings.playerSecondColorG = g;
    this.settings.playerSecondColorB = b;

    this.applyColors();
    this.saveSettings();
  }

  toHex(value: number): string {
    return value.toString(16).padStart(2, '0').toUpperCase();
  }

  resetColors() {
    this.settings.playerMainColor = defaultSettings.playerMainColor;
    this.settings.playerSecondColorR = defaultSettings.playerSecondColorR;
    this.settings.playerSecondColorG = defaultSettings.playerSecondColorG;
    this.settings.playerSecondColorB = defaultSettings.playerSecondColorB;
    this.applyColors();
    this.saveSettings();
  }

  openMainColorPicker() {
    this.mainColorPicker.nativeElement.click();
  }

  openSecondColorPicker() {
    this.secondColorPicker.nativeElement.click();
  }

  checkSkipSegment() {
    if (!this.settings.skipKeys || !this.settings.skipKeys.length) return;

    const current = this.currentPlayerValue;
    const formatToSeconds = (time: string) => {
      const [mm, ss] = time.split(':').map(Number);
      return mm * 60 + ss;
    };

    const segment = this.settings.skipKeys.find(key => {
      const start = formatToSeconds(key.start);
      const end = formatToSeconds(key.end);
      const ignored = this.ignoreSkipKey.includes(key);
      return current >= start && current <= end - 5 && key.active && !ignored;
    });


    if (segment) {
      if (!this.currentSkipSegment) {
        this.currentSkipSegment = true;
        this.activeSkipKey = segment;
        this.startSkipTimer();
      }
    } else {
      this.stopSkipTimer();
      this.currentSkipSegment = false;
    }
  }

  startSkipTimer() {
    this.stopSkipTimer();
    this.skipProgress = 0;

    const step = 50;
    const increment = 100 / (this.skipDuration / step);

    this.skipTimer = setInterval(() => {
      this.skipProgress += increment;
      if (this.skipProgress >= 100) {
        this.skipVideo();
      }
    }, step);
  }

  stopSkipTimer() {
    if (this.skipTimer) {
      clearInterval(this.skipTimer);
      this.skipTimer = null;
    }
    this.skipProgress = 0;
  }

  skipVideo() {
    if (!this.activeSkipKey) return;

    const [mm, ss] = this.activeSkipKey.end.split(':').map(Number);
    this.seekTo(mm * 60 + ss);

    this.stopSkipTimer();
    this.currentSkipSegment = false;
  }

  showElement() {
    if (!this.activeSkipKey) return;

    this.ignoreSkipKey.push(this.activeSkipKey);

    this.stopSkipTimer();
    this.currentSkipSegment = false;
  }

  setVolume(value: number) {
    this.currentSoundValue = value;
    this.videoEl.nativeElement.volume = value / 100;
    StorageUtil.save<number>(PlayerComponent.PLAYER_VOLUME_KEY, value);
  }

  seekTo(value: number) {
    this.currentPlayerValue = value;
    this.videoEl.nativeElement.currentTime = value;
  }
}
