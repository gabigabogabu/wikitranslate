import { Component, OnInit } from '@angular/core';
import {WikipediaService} from "./wikipedia.service";
import {WikiLanguage} from "./wiki-language";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {asyncScheduler, from} from "rxjs";
import {takeLast, throttleTime} from "rxjs/operators";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  private availableSourceLangs: WikiLanguage[];
  private translateFormGroup: FormGroup;
  private autocompleteOptions: any[];
  private availableTargetLangs: WikiLanguage[];
  private translation: string;

  constructor(
    private wikipediaService: WikipediaService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  private initForm() {
    this.createFormGroup();
    this.initAutocomplete();
  }

  private initAutocomplete() {
    this.translateFormGroup.controls.query.valueChanges.pipe(
      throttleTime(
        500, //ms
        asyncScheduler,
        {
          leading: false,
          trailing: true
        })
    ).subscribe(query => {
      console.log('searching:', query);
      this.translateFormGroup.controls.sourceLang.markAsTouched();
      if (this.translateFormGroup.controls.sourceLang.valid) {
        let fromLang = this.translateFormGroup.controls.sourceLang.value;
        this.wikipediaService.search(fromLang.url, query).subscribe(response => {
          this.autocompleteOptions = response;
          console.log(this.autocompleteOptions);
        }, error => {
          console.log(error);
        });
      }
    });
  }

  private createFormGroup() {
    this.translateFormGroup = this.fb.group({
      sourceLang: ['', Validators.required],
      targetLang: ['', Validators.required],
      query: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.wikipediaService.getAllAvailableLangs().subscribe(langs => {
      this.availableSourceLangs = langs;
    }, error => {
      console.log(error);
    });
  }

  autocompleteOptionSelected(wikiSearchResult) {
    console.log(wikiSearchResult);
    this.wikipediaService.getLangLinks(this.translateFormGroup.controls.sourceLang.value.url, wikiSearchResult.title).subscribe(result => {
      this.availableTargetLangs = result;
      console.log(this.availableTargetLangs);
    }, error => {
      console.log(error);
    })
  }

  onTargetLangSelected(langLink: WikiLanguage) {
    console.log(langLink);
    this.wikipediaService.getArticle(langLink.code, langLink.title).subscribe(response => {
      this.translation = langLink.title;
      console.log(this.translation);
    });
  }
}
