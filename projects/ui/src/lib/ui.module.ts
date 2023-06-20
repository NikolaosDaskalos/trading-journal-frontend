import { NgModule } from '@angular/core';
import { UiComponent } from './ui.component';
import { AlertComponent } from './alert/alert.component';
import { SpinerComponent } from './spiner/spiner.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UiComponent, AlertComponent, SpinerComponent],
  imports: [CommonModule],
  exports: [UiComponent, AlertComponent, SpinerComponent],
})
export class UiModule {}
