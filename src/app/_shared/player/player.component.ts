import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'app-player',
  imports: [
    SliderComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  currentPlayerValue = 0;
  currentSoundValue = 0;

  toggleFullscreen() {
    const player = document.querySelector('.player') as HTMLElement;

    if (!document.fullscreenElement) {
      if (player.requestFullscreen) { player.requestFullscreen(); } 
      else if ((player as any).webkitRequestFullscreen) { (player as any).webkitRequestFullscreen(); } 
      else if ((player as any).msRequestFullscreen) { (player as any).msRequestFullscreen(); }
    } 
    else {
      if (document.exitFullscreen) { document.exitFullscreen(); } 
      else if ((document as any).webkitExitFullscreen) { (document as any).webkitExitFullscreen(); } 
      else if ((document as any).msExitFullscreen) { (document as any).msExitFullscreen(); }
    }
  }
}
