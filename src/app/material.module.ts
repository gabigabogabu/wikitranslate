import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MaterialModule { }
