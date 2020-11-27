import { Component, OnInit } from "@angular/core";
import {WikipediaService} from "./wikipedia.service";
import {WikiLanguage} from "./wiki-language";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {asyncScheduler} from "rxjs";
import {throttleTime} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  availableLangs: WikiLanguage[];
  translateFormGroup: FormGroup;
  autocompleteOptions: any[];
  availableTargetLangs: WikiLanguage[];
  availableTranslations: WikiLanguage[];
  result: WikiLanguage;
  sanitizer: DomSanitizer;

  constructor(
    private wikipediaService: WikipediaService,
    private fb: FormBuilder,
    sanitizer: DomSanitizer
  ) {
    this.initForm();
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    this.wikipediaService.getAllAvailableLangs().subscribe(langs => {
      this.availableLangs = langs;
      this.availableTranslations = langs;
    }, error => {
      console.error(error);
    });
  }

  private initForm() {
    this.createFormGroup();
    this.initQueryAutocomplete();
    this.initAutoTranslate();
  }

  private createFormGroup() {
    this.translateFormGroup = this.fb.group({
      sourceLang: [null, Validators.required],
      targetLang: [null, Validators.required],
      query: ['', Validators.required]
    });
  }

  private initQueryAutocomplete() {
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
          // console.log(this.autocompleteOptions);
        }, error => {
          console.error(error);
        });
      }
    });
  }

  private initAutoTranslate() {
    this.translateFormGroup.valueChanges.subscribe(formValues => {
      console.log(formValues);
      // get traget langs
      if (this.translateFormGroup.controls.sourceLang.valid &&
        this.translateFormGroup.controls.query.valid
      ) {
        this.wikipediaService.getLangLinks(this.translateFormGroup.controls.sourceLang.value.url, this.translateFormGroup.controls.query.value).subscribe(result => {
          this.availableTranslations = result;
          this.availableTargetLangs = this.availableLangs.filter(lang => this.availableTranslations.map(value => value.code).includes(lang.code));
          console.log("availableTranslations: ", this.availableTranslations);
        }, error => {
          console.error(error);
        });
      }

      if (this.translateFormGroup.controls.targetLang.valid &&
        this.translateFormGroup.controls.sourceLang.valid &&
        this.translateFormGroup.controls.query.valid
      ) {
        this.result = this.availableTranslations.find(lang => {
          // console.log(lang, this.translateFormGroup.controls.targetLang.value);
          return lang.code === this.translateFormGroup.controls.targetLang.value.code;
        });
        // this.wikipediaService.getArticle(this.result.code, this.result.title).subscribe(article => {
        //   console.log(article)
        // });
      }
    });
  }
}
