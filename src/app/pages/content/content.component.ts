import { Component } from '@angular/core';
import { PlayerComponent } from '../../_shared/player/player.component';

@Component({
  selector: 'app-content',
  imports: [PlayerComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

}
