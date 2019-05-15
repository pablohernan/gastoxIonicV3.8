var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { FormPage } from '../pages/form/form';
import { SincPage } from '../pages/sinc/sinc';
import { HttpModule } from '@angular/http';
/*

    apiKey: "AIzaSyBcVkiIaa4VV8uBFj8obp6KfwSYGEelE7E",
    authDomain: "gastoxteste.firebaseapp.com",
    databaseURL: "https://gastoxteste.firebaseio.com",
    projectId: "gastoxteste",
    storageBucket: "gastoxteste.appspot.com",
    messagingSenderId: "783835888128"

    apiKey: "AIzaSyDr2GPZnMYEjGbkxHxylQjb-hG-pvtiW_Y",
    authDomain: "gastox-36265.firebaseapp.com",
    databaseURL: "https://gastox-36265.firebaseio.com",
    projectId: "gastox-36265",
    storageBucket: "gastox-36265.appspot.com",
    messagingSenderId: "703065408166"
*/

export var firebaseConfig = {
    apiKey: "AIzaSyDr2GPZnMYEjGbkxHxylQjb-hG-pvtiW_Y",
    authDomain: "gastox-36265.firebaseapp.com",
    databaseURL: "https://gastox-36265.firebaseio.com",
    projectId: "gastox-36265",
    storageBucket: "gastox-36265.appspot.com",
    messagingSenderId: "703065408166"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                FormPage,
                SincPage
            ],
            entryComponents: [
                MyApp,
                FormPage,
                SincPage
            ],
            imports: [
                BrowserModule,
                HttpModule,
                IonicModule.forRoot(MyApp),
                AngularFireModule.initializeApp(firebaseConfig, 'demo104'),
                AngularFireDatabaseModule
            ],
            bootstrap: [IonicApp],
            providers: [
                SplashScreen,
                StatusBar,
                { provide: ErrorHandler, useClass: IonicErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map