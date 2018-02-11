var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
//import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
import { FormPage } from '../form/form';
//import { SincPage } from '../sincronia/sincronia';
import { LocalData } from '../utils/local-data';
import { DataUtils } from '../utils/data-utils';
//import { DateFormatPipe } from 'angular2-moment';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, alertCtrl, ld, dUtils) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.ld = ld;
        this.dUtils = dUtils;
        if (!JSON.parse(localStorage.getItem('categorias')))
            this.sincronizar();
        this.initializeItems();
    }
    //this function will be called every time you enter the view
    HomePage.prototype.ionViewWillEnter = function () {
        this.ld.updateLocalList();
        this.ld.updateServerList();
        this.initializeItems();
    };
    HomePage.prototype.initializeItems = function () {
        this.localList = this.ld.getLocalList();
        this.serverList = this.ld.getSeverList();
        this.updateTotal();
        if (this.ld.getItem('utimosDias'))
            this.utimosDias = this.ld.getItem('utimosDias')[0];
        else
            this.utimosDias = 30;
    };
    HomePage.prototype.getItems = function (ev) {
        // Reset items back to all of the items
        this.initializeItems();
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.localList = this.localList.filter(function (item) {
                return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.precio.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.categoria.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.lugar.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            this.serverList = this.serverList.filter(function (item) {
                return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.precio.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.categoria.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.lugar.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            this.updateTotal();
        }
    };
    HomePage.prototype.updateTotal = function () {
        var total = 0;
        for (var index in this.localList) {
            var valor = 0;
            if (!isNaN(parseFloat(this.localList[index].precio))) {
                valor = parseFloat(this.localList[index].precio);
                //console.log( 'valor: ' + valor );
                total = total + valor;
            }
        }
        for (var index2 in this.serverList) {
            var valor2 = 0;
            if (!isNaN(parseFloat(this.serverList[index2].precio))) {
                valor2 = parseFloat(this.serverList[index2].precio);
                //console.log( 'valor: ' + valor );
                total = total + valor2;
            }
        }
        //console.log( total.toFixed(2) );
        this.total = total.toFixed(2);
    };
    HomePage.prototype.newGasto = function () {
        this.navCtrl.push(FormPage);
    };
    HomePage.prototype.sincronizar = function () {
        // this.navCtrl.push(SincPage);
    };
    HomePage = __decorate([
        IonicPage(),
        Component({
            templateUrl: 'home.html',
            selector: 'app',
            //pipes: [DateFormatPipe],
            providers: [LocalData, DataUtils]
        }),
        __metadata("design:paramtypes", [NavController, AlertController, LocalData, DataUtils])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map