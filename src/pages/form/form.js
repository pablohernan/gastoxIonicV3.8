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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalData } from '../utils/local-data';
import { DataUtils } from '../utils/data-utils';
import { CurrencyConvert } from '../utils/currency-convert';
import { Format } from '../utils/format';
/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FormPage = /** @class */ (function () {
    function FormPage(navParams, navCtrl, alertCtrl, ld, dUtils, cc, fmt) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.ld = ld;
        this.dUtils = dUtils;
        this.cc = cc;
        this.fmt = fmt;
        this.lugares = [];
        this.action = this.navParams.get("action");
        this.item = this.navParams.get("item");
        if (this.item) {
            this.nombre = this.item.nombre;
            this.precio = this.fmt.roundNumber(this.cc.getValueConvertInver(this.ld.getItem('monedaSelecionada'), parseFloat(this.item.precio)), 2).toString();
            this.categoria = this.item.categoria;
            this.lugar = this.item.lugar;
            this.descripcion = this.item.descripcion;
            this.fecha = dUtils.unixToDate(this.item.fecha);
        }
        else {
            this.fecha = new Date().toISOString();
        }
        this.ld.updateLugaresList();
        if (this.ld.getItem('monedaSelecionada'))
            this.monedaSelecionada = this.ld.getItem('monedaSelecionada');
        else
            this.monedaSelecionada = 'USD';
        if (this.action == 'del')
            this.msgDelete(this.item);
    }
    //this function will be called every time you enter the view
    FormPage.prototype.ionViewWillEnter = function () {
        this.ld.updateCategoriasList();
        this.ld.updateLugaresList();
        this.ld.updateMonedasList();
    };
    FormPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad FormPage');
    };
    FormPage.prototype.crearGasto = function () {
        switch (this.action) {
            case 'edit': {
                this.ld.editGasto(this.nombre, this.updateCambio(), this.categoria, this.dUtils.dateToUnix(this.fecha.toString()), this.lugar, this.descripcion, this.item.key, this.action);
                this.navCtrl.pop();
                break;
            }
            default: {
                var key = 'local_' + Math.random().toString();
                this.ld.addGasto(this.nombre, this.updateCambio(), this.categoria, this.dUtils.dateToUnix(this.fecha.toString()), this.lugar, this.descripcion, key, this.action);
                this.navCtrl.pop();
                break;
            }
        }
    };
    FormPage.prototype.getCategoriasList = function () {
        return this.ld.getCategoriasList();
    };
    FormPage.prototype.initLugaresList = function () {
        this.lugares = this.getILugaresList();
    };
    FormPage.prototype.getILugaresList = function () {
        return this.ld.getILugaresList();
    };
    FormPage.prototype.lugarAutocomplete = function (ev) {
        var value = ev;
        this.lugares = [];
        if (value != '') {
            this.initLugaresList();
            this.lugares = this.lugares.filter(function (item) {
                return (item.toLowerCase().indexOf(value.toLowerCase()) > -1);
            });
        }
    };
    FormPage.prototype.chooseItem = function (item) {
        this.lugar = item;
        this.lugares = [];
    };
    FormPage.prototype.getListMonedas = function () {
        return this.ld.getItem('monedas');
    };
    FormPage.prototype.updateCambio = function () {
        if (this.precio && this.precio != '') {
            var sigla = this.monedaSelecionada;
            return this.fmt.roundNumber(this.cc.getValueConvert(sigla, parseFloat(this.precio)), 2).toString();
        }
        else {
            return '0';
        }
    };
    FormPage.prototype.setMoneda = function (ev) {
        var value = ev;
        var sigla = value.split('-')[0].trim();
        this.monedaSelecionada = sigla;
        this.ld.setItem('monedaSelecionada', sigla);
    };
    FormPage.prototype.msgDelete = function (item) {
        //console.log(task.key)
        var confirm = this.alertCtrl.create({
            title: 'Está seguro/a que desea eliminar el gasto?',
            subTitle: 'Esta acción eliminará el registro del sistema.',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: function () {
                    }
                },
                {
                    text: 'Eliminar',
                    handler: function () {
                        //this.edit(item);
                    }
                }
            ]
        });
        confirm.present();
    };
    FormPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-form',
            templateUrl: 'form.html',
            providers: [LocalData, DataUtils, CurrencyConvert, Format]
        }),
        __metadata("design:paramtypes", [NavParams,
            NavController,
            AlertController,
            LocalData,
            DataUtils,
            CurrencyConvert,
            Format])
    ], FormPage);
    return FormPage;
}());
export { FormPage };
//# sourceMappingURL=form.js.map