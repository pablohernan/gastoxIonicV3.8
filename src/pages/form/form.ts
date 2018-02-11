import { Component } from '@angular/core';
import { IonicPage, NavController , NavParams , AlertController } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
  providers: [LocalData,DataUtils,CurrencyConvert,Format]
})
export class FormPage {

  localObj: Array<any>;

  fecha: String;
  nombre:string;  
  categoria:string;  
  descripcion:string;  
  precio:string; 
  lugar:string;       
  key:string; 
  action:string; 
  lugares:Array<any> = [];
  monedas:string;
  monedaSelecionada:string;
  item:any;
  constructor(
    public navParams:NavParams , 
    public navCtrl: NavController , 
    public alertCtrl: AlertController, 
    public ld:LocalData , 
    public dUtils:DataUtils ,  
    public cc:CurrencyConvert , 
    public fmt:Format
    ) {
    
    //cargo los datos
    this.nombre = "vamooo";
    this.action = this.navParams.get("action");
    this.item = this.navParams.get("item");
    if(this.item){
      this.nombre = this.item.nombre;
      
      this.precio = this.fmt.roundNumber(
        this.cc.getValueConvertInver(
          this.ld.getItem('monedaSelecionada'), parseFloat(this.item.precio) ),2
        ).toString();

      this.categoria = this.item.categoria;
      this.lugar = this.item.lugar;
      this.descripcion = this.item.descripcion;
    }


    this.fecha = new Date().toISOString();
    this.ld.updateLugaresList();
    if(this.ld.getItem('monedaSelecionada'))
      this.monedaSelecionada = this.ld.getItem('monedaSelecionada');
    else
      this.monedaSelecionada = 'USD';

    if(this.action == 'del')
      this.msgDelete(this.item);

  }  

  //this function will be called every time you enter the view
  ionViewWillEnter() {
      this.ld.updateCategoriasList();
      this.ld.updateLugaresList();
      this.ld.updateMonedasList();
  }    

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPage');
  }

   crearGasto() {


      var arrayObj = {
          nombre:this.nombre,
          categoria:this.categoria,
          fecha:this.dUtils.dateToUnix(this.fecha.toString()),
          lugar:this.lugar,
          descripcion:this.descripcion,
          key:this.key,
          action:this.action
      }; 

      //seto lugar 
      this.ld.setItemLugar(this.lugar);

      this.localObj = this.ld.getItem('local');

      if( ! this.localObj )
        this.localObj = [];

      this.localObj.push(arrayObj);
      this.ld.setItem('local' , this.localObj );

      this.navCtrl.pop();

  }


  getCategoriasList(){
    return this.ld.getCategoriasList();
  } 


  initLugaresList(){
    this.lugares = this.getILugaresList();
  }

  getILugaresList(){
    return this.ld.getILugaresList();
  }

  lugarAutocomplete( ev: any ){
    
    let value = ev;

    this.lugares = [];

    if( value != '' ){
      this.initLugaresList();
      this.lugares = this.lugares.filter((item) => {
        return (item.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });

    }
  }

  chooseItem(item){
    this.lugar = item; 
    this.lugares = [];
  }

  getListMonedas(){
    return this.ld.getItem('monedas');
  }     

  updateCambio(){

    if( this.precio && this.precio !='' ){
      var sigla = this.monedaSelecionada;
      return this.fmt.roundNumber(this.cc.getValueConvert( sigla , parseFloat(this.precio) ),2).toString();
    }else{
      return '0';
    }
 
  }  

  setMoneda( ev: any ){
    let value = ev;

    var sigla = value.split('-')[0].trim();
    this.monedaSelecionada = sigla; 
    this.ld.setItem('monedaSelecionada', sigla );
  }


  msgDelete( item ) {
      //console.log(task.key)
      let confirm = this.alertCtrl.create({
        title: 'Está seguro/a que desea eliminar el gasto?',
        subTitle: 'Esta acción eliminará el registro del sistema.',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.edit(item);
            }
          }
        ]
      });
      confirm.present();
  }


}
