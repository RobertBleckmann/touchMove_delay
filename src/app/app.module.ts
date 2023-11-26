import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import 'zone.js';

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
