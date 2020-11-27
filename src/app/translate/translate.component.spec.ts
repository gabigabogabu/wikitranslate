import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateComponent } from './translate.component';
import {MaterialModule} from "../material.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('TranslateComponent', () => {
  let component: TranslateComponent;
  let fixture: ComponentFixture<TranslateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslateComponent ],
      imports: [
        MaterialModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
