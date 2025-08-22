import { Component, AfterViewInit } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsPanel } from './SettingsPanel';

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
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements AfterViewInit {
  SettingsPanel = SettingsPanel;

  settingsVisible = false;
  qualitySettingsVisible = false;
  speedSettingsVisible = false;
  timerSettingsVisible = false;
  colorSettingsVisible = false;
  hotKeysSettingsVisible = false;

  currentPlayerValue = 0;
  currentSoundValue = 0;

  SelectedSpeed = 1;
  SelectedQuality = 1;
  SkipOpening = false;
  SkipEnding = false;
  AutoPlay = false;
  FullScreen = false;
  SleepCheckTimer = 1;

  async togglePiP() {
    const videoEl = document.querySelector('video') as HTMLVideoElement;

    if (!videoEl) { return; }

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await videoEl.requestPictureInPicture();
    }
  }

  toggleFullscreen() {
    const player = document.querySelector('.player') as HTMLElement;

    if (!document.fullscreenElement) {
      if (player.requestFullscreen) { player.requestFullscreen(); } 
      else if ((player as any).webkitRequestFullscreen) { (player as any).webkitRequestFullscreen(); } 
      else if ((player as any).msRequestFullscreen) { (player as any).msRequestFullscreen(); }
      this.FullScreen = true;
    } 
    else {
      if (document.exitFullscreen) { document.exitFullscreen(); } 
      else if ((document as any).webkitExitFullscreen) { (document as any).webkitExitFullscreen(); } 
      else if ((document as any).msExitFullscreen) { (document as any).msExitFullscreen(); }
      this.FullScreen = false;
    }
  }

  ngAfterViewInit() {
    document.addEventListener('click', (e) => {
      const panel = document.querySelector('.all-settings');
      const button = document.querySelector('.player-button-settings');
      
      if (!panel?.contains(e.target as Node) && !button?.contains(e.target as Node)) {
        this.settingsVisible = false;
        this.qualitySettingsVisible = false;
        this.speedSettingsVisible = false;
        this.timerSettingsVisible = false;
        this.colorSettingsVisible = false;
        this.hotKeysSettingsVisible = false;
      }
    });
    
    return;

    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable) {
        this.initializeCast();
      }
    };
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
    switch(panel) {
      case SettingsPanel.Main:
        this.settingsVisible = !this.settingsVisible;
        if (!this.settingsVisible){
          this.qualitySettingsVisible = false;
          this.speedSettingsVisible = false;
          this.timerSettingsVisible = false;
          this.colorSettingsVisible = false;
          this.hotKeysSettingsVisible = false;
        }
        break;
      case SettingsPanel.Quality:
        this.qualitySettingsVisible = !this.qualitySettingsVisible;
        break;
      case SettingsPanel.Speed:
        this.speedSettingsVisible = !this.speedSettingsVisible;
        break;
      case SettingsPanel.Timer:
        if (this.AutoPlay) this.timerSettingsVisible = !this.timerSettingsVisible;
        else this.timerSettingsVisible = false;
        break;
      case SettingsPanel.Color:
        this.colorSettingsVisible = !this.colorSettingsVisible;
        break;
      case SettingsPanel.HotKeys:
        this.hotKeysSettingsVisible = !this.hotKeysSettingsVisible;
        break;
    }
  }
}
