import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-login',
  imports: [TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _translateService = inject(TranslateService);

  setLang(lang: "es" | "en") {
    this._translateService.use(lang);
  }
}
