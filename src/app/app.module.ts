import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import 'zone.js';
import {DrawDirective} from "./draw.directive";

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [AppComponent, DrawDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
