import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 100;

  @Input() set value(v: number) {
    this._value = this.clamp(v);
    this.updateThumbPosition();
  }
  get value() {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<number>();

  private _value: number = 0;
  thumbPosition = 0;
  isDragging = false;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.updateThumbPosition();
  }

  private clamp(v: number): number {
    return Math.min(this.max, Math.max(this.min, v));
  }

  private updateThumbPosition() {
    const range = this.max - this.min;
    const percent = ((this.value - this.min) / range) * 100;
    this.thumbPosition = percent;
    this.host.nativeElement.style.setProperty('--slider-progress', `${percent}%`);
  }

  onTrackMouseDown(event: MouseEvent) {
    const thumbEl = this.host.nativeElement.querySelector('.slider-thumb');
    if (thumbEl.contains(event.target)) {
      return;
    }

    event.preventDefault();
    const rect = this.host.nativeElement.querySelector('.slider-track').getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = clickX / rect.width;

    this.updateValueFromPercent(percent);
    this.isDragging = true;
  }

  startThumbDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    const rect = this.host.nativeElement.querySelector('.slider-track').getBoundingClientRect();
    const moveX = event.clientX - rect.left;
    const percent = moveX / rect.width;
    this.updateValueFromPercent(percent);
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.isDragging = false;
  }

  private updateValueFromPercent(percent: number) {
    percent = Math.min(1, Math.max(0, percent));
    const range = this.max - this.min;
    this.value = this.min + range * percent;
    this.valueChange.emit(this.value);
    this.updateThumbPosition();
  }
}