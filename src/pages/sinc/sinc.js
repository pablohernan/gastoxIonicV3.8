var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { LocalData } from '../utils/local-data';
import { DataUtils } from '../utils/data-utils';
import { CurrencyConvert } from '../utils/currency-convert';
import { AngularFireDatabase } from 'angularfire2/database';
var SincPage = /** @class */ (function () {
    function SincPage(navCtrl, database, loadingCtrl, ld, dUtils, cc) {
        this.navCtrl = navCtrl;
        this.database = database;
        this.loadingCtrl = loadingCtrl;
        this.ld = ld;
        this.dUtils = dUtils;
        this.cc = cc;
        this.dbListCategorias = this.database.list('/gastox/datos/categorias').valueChanges();
        if (this.ld.getItem('utimosDias'))
            this.utimosDias = this.ld.getItem('utimosDias')[0];
        else
            this.utimosDias = 30;
    }
    SincPage.prototype.localToServer = function () {
        this.abrirLoading();
        //var fireList = this.af.database.list('/gastox/datos/gastos');
        this.dbListServerRef = this.database.list('gastox/datos/gastos');
        this.dbListServer = this.dbListServerRef.valueChanges();
        var localArray = this.ld.getItem('local'); // JSON.parse(localStorage.getItem('local'));
        this.pushFinish = false;
        if (localArray) {
            for (var i = 0; i < localArray.length; i++) {
                this.dbListServerRef.push({
                    nombre: (localArray[i].nombre) ? localArray[i].nombre : '',
                    precio: (localArray[i].precio) ? localArray[i].precio : '',
                    categoria: (localArray[i].categoria) ? localArray[i].categoria : '',
                    fecha: (localArray[i].fecha) ? localArray[i].fecha : '',
                    lugar: (localArray[i].lugar) ? localArray[i].lugar : '',
                    descripcion: (localArray[i].descripcion) ? localArray[i].descripcion : ''
                }).then(function (ref) {
                    //console.log(ref);
                }, function (error) {
                    console.log("Error:", error);
                });
            }
        }
        this.categoriasToLocal();
    };
    SincPage.prototype.categoriasToLocal = function () {
        var _this = this;
        var categoriasArray = [];
        var count = 0;
        this.dbListCategorias.subscribe().unsubscribe();
        this.dbListCategorias.subscribe(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                categoriasArray.push(snapshot);
                count++;
                if (snapshots.length == count) {
                    _this.ld.setItem('categorias', []);
                    _this.ld.setItem('categorias', categoriasArray);
                    _this.monedasToLocal();
                }
            });
        });
    };
    /* guardo la lista de monedas de la db localmente */
    SincPage.prototype.monedasToLocal = function () {
        var _this = this;
        var monedasArray = [];
        var count = 0;
        this.dbListMonedasRef = this.database.list('gastox/monedas');
        this.dbListMonedas = this.dbListMonedasRef.valueChanges();
        this.dbListMonedas.subscribe().unsubscribe();
        this.dbListMonedas.subscribe(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                monedasArray.push(snapshot);
                count++;
                if (snapshots.length == count) {
                    _this.ld.setItem('monedas', []);
                    _this.ld.setItem('monedas', monedasArray);
                    _this.cambioToLocal();
                }
            });
        });
    };
    SincPage.prototype.cambioToLocal = function () {
        var monedasArray = this.ld.getItem('monedas');
        // init
        this.ld.setItem('cambio', []);
        for (var i = 0; i < monedasArray.length; i++) {
            this.cc.getConvert(monedasArray[i].sigla, 'USD', function (value, from, to) {
                /* utilizo o localStorage directo y no this.ld por ser una llamada async , no reconoce this.ld */
                var mArray = JSON.parse(localStorage.getItem('cambio'));
                mArray.push({ 'from': from, 'to': to, 'value': value });
                localStorage.setItem('cambio', JSON.stringify(mArray));
            });
        }
        this.serverToLocal();
    };
    SincPage.prototype.serverToLocal = function () {
        var _this = this;
        var serverArray = [];
        var count = 0;
        var dataFilter = new Date();
        dataFilter.setDate(dataFilter.getDate() - this.utimosDias);
        var start = this.dUtils.dateToUnix(this.dUtils.dateToString(dataFilter));
        this.ld.setItem('utimosDias', [this.utimosDias]);
        this.dbListServer = this.database.list('gastox/datos/gastos', function (ref) { return ref
            .orderByChild('fecha')
            .startAt(start); })
            .snapshotChanges().map(function (actions) {
            return actions.map(function (action) { return (__assign({ key: action.key }, action.payload.val())); });
        });
        this.dbListServer.subscribe().unsubscribe();
        this.dbListServer.subscribe(function (snapshots) {
            if (snapshots.length == 0) {
                //localStorage.setItem('local', JSON.stringify([]) );
                //localStorage.setItem('server', JSON.stringify([]) );
                _this.ld.setItem('local', []);
                _this.ld.setItem('server', []);
                _this.navCtrl.pop();
                _this.cerrar();
            }
            snapshots.forEach(function (snapshot) {
                //console.log(snapshot.key, snapshot.val());
                snapshot.action = 'server';
                serverArray.push(snapshot);
                // set lugar para el autocomplete
                _this.ld.setItemLugar(snapshot.lugar);
                count++;
                if (snapshots.length == count) {
                    _this.ld.setItem('local', []);
                    _this.ld.setItem('server', []);
                    _this.ld.setItem('server', serverArray);
                    _this.navCtrl.pop();
                    _this.cerrar();
                }
            });
        });
    };
    SincPage.prototype.abrirLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: "Sincronizando..."
        });
        this.loader.present();
    };
    SincPage.prototype.cerrar = function () {
        this.loader.dismiss();
    };
    /* gambi para hacer update */
    SincPage.prototype.updateData = function () {
        /*
            var serverArray = [];
            var count:number = 0;
        
            //console.log( this.cc.getValueConvert('BRL' , 7.60 ) );
        
            this.dbListServer = this.af.database.list('gastox/datos/gastos',
                {   preserveSnapshot: true  });
        
            this.dbListServer.subscribe().unsubscribe();
            this.dbListServer.subscribe(snapshots=>{
                  
                  if(snapshots.length==0){
                      this.navCtrl.pop();
                  }
        
                  snapshots.forEach(snapshot => {
                    //console.log(snapshot.key, snapshot.val());
                    //serverArray.push(snapshot.val());
                   //var f = snapshot.val().fecha.split('T')[0];
                    //var f = this.cc.getValueConvert('BRL', snapshot.val().precio );
                    var f = snapshot.val().precio;
                    //var unix = this.dUtils.dateToUnix(f);
                    var key = snapshot.key;
         
                    console.log( "this.af.database.object('gastox/datos/gastos/"+key+"/precio').set(""+ this.cc.getValueConvert('BRL' , f ) +")");
        
                    count++;
                    if(snapshots.length == count ){
                        this.navCtrl.pop();
                    }
             
                  });
                  
        
                  
              })
        
        */
        /*
        
        this.af.database.object('gastox/datos/gastos/-KWcrVe5MORPgTiGSHdG/precio').set("18.2404");
        this.af.database.object('gastox/datos/gastos/-KWcrVeggctfUKbYDnwM/precio').set("33.5388");
        this.af.database.object('gastox/datos/gastos/-KWcrVerDXn9x2uG8FUY/precio').set("4.413");
        this.af.database.object('gastox/datos/gastos/-KWcrVetSfYKqCMLJ065/precio').set("14.1216");
        this.af.database.object('gastox/datos/gastos/-KWdSXEvD4ANRL1zDqTB/precio').set("8.826");
        this.af.database.object('gastox/datos/gastos/-KWdSXFTCWtu4gNN2iLD/precio').set("7.9434000000000005");
        this.af.database.object('gastox/datos/gastos/-KWdSXFcQ-T3FGbCAWtJ/precio').set("3.818716");
        this.af.database.object('gastox/datos/gastos/-KWmLZQwFzmCWNTeoSzm/precio').set("12.3564");
        this.af.database.object('gastox/datos/gastos/-KWmLZRW4tGZIpDjbGuZ/precio').set("13.239");
        this.af.database.object('gastox/datos/gastos/-KWmLZRblyLD0_hkFM15/precio').set("31.479400000000002");
        this.af.database.object('gastox/datos/gastos/-KWoQ_8xRbjW-Muot3oh/precio').set("8.2376");
        this.af.database.object('gastox/datos/gastos/-KWrvHwMmnyMwIQQWVch/precio').set("5.57509");
        this.af.database.object('gastox/datos/gastos/-KWrvHwe_QJwgFk6eh9r/precio').set("6.1782");
        this.af.database.object('gastox/datos/gastos/-KWtaTrq8j2wTYiN1uZN/precio').set("11.23844");
        this.af.database.object('gastox/datos/gastos/-KWtjURC_iw3tbZkyduo/precio').set("1.0297");
        this.af.database.object('gastox/datos/gastos/-KWtjURMn65WJ2dZTM8S/precio').set("2.6478");
        this.af.database.object('gastox/datos/gastos/-KWtjUROL6hszvFFYBrz/precio').set("22.3592");
        this.af.database.object('gastox/datos/gastos/-KWtjURQE3ripMbOajR5/precio').set("16.316332000000003");
        this.af.database.object('gastox/datos/gastos/-KWtjURQE3ripMbOajR6/precio').set("0.7355");
        this.af.database.object('gastox/datos/gastos/-KWtjURRj6eTRwwe58_I/precio').set("3.5304");
        this.af.database.object('gastox/datos/gastos/-KWtjURRj6eTRwwe58_J/precio').set("11.768");
        this.af.database.object('gastox/datos/gastos/-KWtjURStrTq6OXs9DTI/precio').set("5.884");
        this.af.database.object('gastox/datos/gastos/-KWtjURTHunMKKq3efN_/precio').set("5.0014");
        this.af.database.object('gastox/datos/gastos/-KWtjURUdpUmWu2pO2Gh/precio').set("4.1188");
        this.af.database.object('gastox/datos/gastos/-KWtjURVbSWinpEHzE5X/precio').set("6.1782");
        this.af.database.object('gastox/datos/gastos/-KWtjURXhaf-Vi7enRpa/precio').set("6.1782");
        this.af.database.object('gastox/datos/gastos/-KWtjURYgocpCDKywnrD/precio').set("2.3536");
        this.af.database.object('gastox/datos/gastos/-KWtjUR_z_NoOkNQyVvs/precio').set("4.1188");
        this.af.database.object('gastox/datos/gastos/-KWtjUR_z_NoOkNQyVvt/precio').set("0.8826");
        this.af.database.object('gastox/datos/gastos/-KWtlDTSt_HpBOar8g9I/precio').set("11.4738");
        this.af.database.object('gastox/datos/gastos/-KWtlDTXk12FssNE7mZS/precio').set("1.1768");
        this.af.database.object('gastox/datos/gastos/-KWtlDTYQRDO2r4F3de1/precio').set("1.7652");
        this.af.database.object('gastox/datos/gastos/-KWtlDTZd1Me5WR4gm1a/precio').set("2.942");
        this.af.database.object('gastox/datos/gastos/-KWtnw_GnRXM4g4Hfk3K/precio').set("2.0594");
        this.af.database.object('gastox/datos/gastos/-KWtnw_LoJnCUKG00RV2/precio').set("2.6478");
        this.af.database.object('gastox/datos/gastos/-KWtnw_LoJnCUKG00RV3/precio').set("0.8826");
        this.af.database.object('gastox/datos/gastos/-KWtnw_MdQlgV9V_mDTh/precio').set("8.826");
        this.af.database.object('gastox/datos/gastos/-KWtnw_NIYq5FLEgW2_v/precio').set("22.9476");
        this.af.database.object('gastox/datos/gastos/-KWtnw_NIYq5FLEgW2_w/precio').set("4.1188");
        this.af.database.object('gastox/datos/gastos/-KWtnw_OiwuX8t87Tjx9/precio').set("22.3592");
        this.af.database.object('gastox/datos/gastos/-KWtnw_RTbynFU8Z9sm9/precio').set("2.6478");
        this.af.database.object('gastox/datos/gastos/-KWtnw_RTbynFU8Z9smA/precio').set("2.3536");
        this.af.database.object('gastox/datos/gastos/-KWtovj7erwts-LrmlfZ/precio').set("2.23592");
        this.af.database.object('gastox/datos/gastos/-KWtovjDH5QucCYOCnr-/precio').set("17.652");
        this.af.database.object('gastox/datos/gastos/-KWtovjEylwrdqXiBQRO/precio').set("0.8826");
        this.af.database.object('gastox/datos/gastos/-KWtovjFZVA-VX09kyTb/precio').set("2.23592");
        this.af.database.object('gastox/datos/gastos/-KWtrdkFdufDQ4BKiY5_/precio').set("8.826");
        this.af.database.object('gastox/datos/gastos/-KWtrdkLnN2EGBJ0XX7o/precio').set("0.5884");
        this.af.database.object('gastox/datos/gastos/-KWtrdkLnN2EGBJ0XX7p/precio').set("4.47184");
        this.af.database.object('gastox/datos/gastos/-KWtrdkNFaTog2o1sG0a/precio').set("7.355");
        this.af.database.object('gastox/datos/gastos/-KWtrdkNFaTog2o1sG0b/precio').set("4.413");
        this.af.database.object('gastox/datos/gastos/-KWtrdkOobKjcbAi9ZVu/precio').set("14.71");
        this.af.database.object('gastox/datos/gastos/-KWtrdkOobKjcbAi9ZVv/precio').set("4.1188");
        this.af.database.object('gastox/datos/gastos/-KWtrdkQXDst_dteqvU5/precio').set("4.47184");
        this.af.database.object('gastox/datos/gastos/-KWtrdkR_nmNCz0YXlgV/precio').set("14.71");
        this.af.database.object('gastox/datos/gastos/-KWtrdkTwOyIRY9Thq6M/precio').set("2.942");
        this.af.database.object('gastox/datos/gastos/-KWtrdkWWN2Unq-SW9YY/precio').set("1.471");
        this.af.database.object('gastox/datos/gastos/-KX1-em6Ce3qPq7QjOyn/precio').set("13.9745");
        this.af.database.object('gastox/datos/gastos/-KX1-emT409Pl8B0dahS/precio').set("3.818716");
        this.af.database.object('gastox/datos/gastos/-KX1-emdIl63qz1glJJI/precio').set("1.3239");
        this.af.database.object('gastox/datos/gastos/-KX5aJR756qrtPrV2N4m/precio').set("23.536");
        this.af.database.object('gastox/datos/gastos/-KX5aJRPPcbcYD_rBE60/precio').set("20.594");
        this.af.database.object('gastox/datos/gastos/-KXFsCBUurbqaWj381tD/precio').set("28.363822");
        this.af.database.object('gastox/datos/gastos/-KXFsCBlChPzFj_r6snM/precio').set("13.403752");
        this.af.database.object('gastox/datos/gastos/-KXQlKUTFR3h7mXsut4q/precio').set("4.413");
        this.af.database.object('gastox/datos/gastos/-KXQn8FJltR9dMmTbCOA/precio').set("23.536");
        this.af.database.object('gastox/datos/gastos/-KXQn8FN3eE3-N_3XOHc/precio').set("14.71");
        this.af.database.object('gastox/datos/gastos/-KXQn8FOZPz17L5y1D7E/precio').set("9.1202");
        this.af.database.object('gastox/datos/gastos/-KXQn8FPJnaZQQRrjijv/precio').set("10.67946");
        this.af.database.object('gastox/datos/gastos/-KXYHpBmnxH9F3PCFO9J/precio').set("46.7778");
        this.af.database.object('gastox/datos/gastos/-KXYHpC6cpZ4HSJJjcyw/precio').set("2.942");
        this.af.database.object('gastox/datos/gastos/-KXYHpCFvpCFK8dq7ZE3/precio').set("4.413");
        this.af.database.object('gastox/datos/gastos/-KXfVc-X2xP0YBznONA3/precio').set("5.884");
        this.af.database.object('gastox/datos/gastos/-KXfVc-p-wTiDfC_0N93/precio').set("65.9008");
        this.af.database.object('gastox/datos/gastos/-KXfWFS4uMOinbBlVHbS/precio').set("5.50154");
        this.af.database.object('gastox/datos/gastos/-KXqN1V7LA-OLjGDGIKd/precio').set("18.269820000000003");
        this.af.database.object('gastox/datos/gastos/-KXqN1VUaQ-2Hlh0xEdn/precio').set("33.50938");
        this.af.database.object('gastox/datos/gastos/-KXqN1VYgisjnMb99JAK/precio').set("13.239");
        this.af.database.object('gastox/datos/gastos/-KXqN1Va7mCdTyIsJkx8/precio').set("9.4144");
        this.af.database.object('gastox/datos/gastos/-KXqN1Vga0n94BMQtBub/precio').set("3.2362");
        this.af.database.object('gastox/datos/gastos/-KXqN1Viu0nCynofv2I7/precio').set("4.7072");
        this.af.database.object('gastox/datos/gastos/-KXqN1Vl0k1GPS7OpPYV/precio').set("3.6775");
        this.af.database.object('gastox/datos/gastos/-KXqNRUbGD3K_wHXsuTJ/precio').set("7.0608");
        this.af.database.object('gastox/datos/gastos/-KXqNRUultuuRfn4XwnT/precio').set("3.3833");
        this.af.database.object('gastox/datos/gastos/-KXqOpnyeXFe1wZdzj2W/precio').set("11.768");
        this.af.database.object('gastox/datos/gastos/-KXuWgGgv4n4FTAXqD79/precio').set("4.577752");
        this.af.database.object('gastox/datos/gastos/-KXzD6oFIWlRoGXpta_Y/precio').set("14.1216");
        this.af.database.object('gastox/datos/gastos/-KXzD6oX6fG4ZAiK4of5/precio').set("20.594");
        this.af.database.object('gastox/datos/gastos/-KY0V7K8vEo0xSNl5Pkz/precio').set("18.975900000000003");
        this.af.database.object('gastox/datos/gastos/-KY0nQdqhXQVy4OpiB1E/precio').set("3.8246");
        
        */
    };
    SincPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SincPage');
    };
    SincPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-sinc',
            templateUrl: 'sinc.html',
            providers: [LocalData, DataUtils, CurrencyConvert]
        }),
        __metadata("design:paramtypes", [NavController,
            AngularFireDatabase,
            LoadingController,
            LocalData,
            DataUtils,
            CurrencyConvert])
    ], SincPage);
    return SincPage;
}());
export { SincPage };
//# sourceMappingURL=sinc.js.map