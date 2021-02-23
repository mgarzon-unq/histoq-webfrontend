import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ShowImageDialogComponent } from './components/show-image-dialog/show-image-dialog.component';
import { ImageBatchListComponent } from './components/image-batch-list/image-batch-list.component';
import { ImageBatchComponent } from './components/image-batch/image-batch.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ImageFilesListComponent } from './components/image-files-list/image-files-list.component';
import { ImageFilesUploaderComponent } from './components/image-files-uploader/image-files-uploader.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImagesListComponent } from './components/images-list/images-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { SignInOutComponent } from './components/sign-in-out/sign-in-out.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';
import { MatMenuModule } from '@angular/material/menu';
import { TokenInterceptor } from './services/http/token.interceptor';
import { GoogleClientId } from 'src/environments/environment';
import { SecurePipe } from './services/http/secure-pipe';
import { LogInComponent } from './components/log-in/log-in.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PaginatorI18n } from './components/common/paginator-i18n';
import { ImageBatchesDataExportComponent } from './components/image-batches-data-export/image-batches-data-export.component';
import { UserOptionComponent } from './components/user-option/user-option.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { RegistrationRequestComponent } from './components/registration-request/registration-request.component';
import { UsersManagementButtonComponent } from './components/users-management-button/users-management-button.component';
import { MatBadgeModule } from '@angular/material/badge';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserRegistrationRequestListComponent } from './components/user-registration-request-list/user-registration-request-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UserDataComponent } from './components/user-data/user-data.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShowImageDialogComponent,
    ImageBatchListComponent,
    ImageBatchComponent,
    LanguageSelectorComponent,
    ImageFilesListComponent,
    ImageFilesUploaderComponent,
    ImagesListComponent,
    SignInOutComponent,
    SecurePipe,
    LogInComponent,
    ImageBatchesDataExportComponent,
    UserOptionComponent,
    RegistrationRequestComponent,
    UsersManagementButtonComponent,
    UsersManagementComponent,
    UserListComponent,
    UserRegistrationRequestListComponent,
    UserDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatGridListModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    SocialLoginModule,
    MatMenuModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatTooltipModule, 
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: true
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      },
      defaultLanguage: 'sp'
    }),
    RecaptchaV3Module,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(GoogleClientId,{prompt: "select_account"}),
            //https://developers.google.com/identity/sign-in/web/reference  
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('453294245921829'),
          }/*,
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              'clientId'
            ),
          },*/
        ],
      } as SocialAuthServiceConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl, 
      useClass: PaginatorI18n
    },
    { 
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6Ld7dGMaAAAAAHYkLVxkLB4LNgOoTc3vq_0owYCa' 
    },    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
