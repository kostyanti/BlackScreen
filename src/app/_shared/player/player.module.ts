import { CommonModule } from "@angular/common";
import { PlayerComponent } from "./player.component";
import { NgModule, Pipe, PipeTransform } from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    PlayerComponent,
  ],
  exports: [
    PlayerComponent,
  ]
})
export class PlayerModule {
    
}

@Pipe({ name: 'formatTime', standalone: true })
export class FormatTimePipe implements PipeTransform {
  transform(seconds: number): string {
    const time = Math.floor(seconds);

    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);

    if (h > 0) {
      return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    }
    return [m, s].map(v => String(v).padStart(2, '0')).join(':');
  }
}

export function toHex(value: number): string {
  return value.toString(16).padStart(2, '0').toUpperCase();
}

export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
