import { Component, OnInit } from '@angular/core';
import {WikipediaService} from "./wikipedia.service";
import {WikiLanguage} from "./wiki-language";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {asyncScheduler} from "rxjs";
import {throttleTime} from "rxjs/operators";

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
  private translation: WikiLanguage;

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

  private createFormGroup() {
    this.translateFormGroup = this.fb.group({
      sourceLang: ['', Validators.required],
      targetLang: ['', Validators.required],
      query: ['', Validators.required]
    });
  }

  private initAutocomplete() {
    this.translateFormGroup.controls.query.valueChanges.pipe(
      throttleTime(
        500, //ms
        asyncScheduler,
        {
          leading: true,
          trailing: true
        })
    ).subscribe(query => {
      console.log('searching for: ', query);
      this.translateFormGroup.controls.sourceLang.markAsTouched();
      if (this.translateFormGroup.controls.sourceLang.valid) {
        let fromLang = this.translateFormGroup.controls.sourceLang.value;
        this.wikipediaService.search(fromLang.url, query).subscribe(response => {
          this.autocompleteOptions = response;
          console.log("autocompleteOptions: ", this.autocompleteOptions);
        }, error => {
          console.log("error searching for " + query + ": " + error);
        });
      }
    });
  }

  ngOnInit() {
    this.wikipediaService.getAllAvailableLangs().subscribe(langs => {
      this.availableSourceLangs = langs;
    }, error => {
      console.log("error getting all available languages: ", error);
    });
  }

  autocompleteQueryOptionSelected(wikiSearchResult) {
    console.log("autocomplete query option selected: ", wikiSearchResult);
    this.wikipediaService.getLangLinks(
        this.translateFormGroup.controls.sourceLang.value.url,
        wikiSearchResult.title
    ).subscribe(result => {
      this.availableTargetLangs = result;
      console.log("target langs possible: ", this.availableTargetLangs);
    }, error => {
      console.log("error target lang selection: ", error);
    })
  }

  onTargetLangSelected(langLink: WikiLanguage) {
    console.log("target language selected: ", langLink);
    this.wikipediaService.getArticle(langLink.code, langLink.title).subscribe(response => {
      this.translation = langLink;
      console.log("translation: ", this.translation);
      // console.log("translation: ", response['parse']['text']['*']);
    });
  }
}
