import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {

  constructor(private translate: TranslateService) { }
  
  ngOnInit() {
  }

  switchLanguage() {
    let languages = this.translate.getLangs();
    let currentLangIndex = languages.indexOf(this.translate.currentLang);
    let nextIndex = (currentLangIndex+1)%languages.length;
    this.translate.use(languages[nextIndex]);
  }

}
