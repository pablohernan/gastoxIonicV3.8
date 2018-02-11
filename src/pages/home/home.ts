import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController} from 'ionic-angular';
//import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
import { FormPage } from '../form/form';
import { SincPage } from '../sinc/sinc';
import { LocalData } from '../utils/local-data';
import { DataUtils } from '../utils/data-utils';
import { Format } from '../utils/format';
//import { DateFormatPipe } from 'angular2-moment';

@IonicPage()
@Component({
  templateUrl: 'home.html',
  selector: 'app', // 'page-home',
  //pipes: [DateFormatPipe],
  providers: [LocalData,DataUtils,Format]
})
export class HomePage {
  // tasksRef: AngularFireList<any>;
  // tasks: Observable<any[]>;
  localList : Array<any>;
  serverList : Array<any>;
  total : String;
  utimosDias : number;
  precio : any;
  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public ld:LocalData, 
    public dUtils:DataUtils, 
    public fmt:Format) {

     if(! JSON.parse(localStorage.getItem('categorias')) )
         this.sincronizar();

     this.initializeItems(); 

  }

  //this function will be called every time you enter the view
  ionViewWillEnter() {
      this.ld.updateLocalList();
      this.ld.updateServerList();
      this.initializeItems();   
  }  


  initializeItems() {
      this.localList = this.ld.getLocalList();
      this.serverList = this.ld.getSeverList();
      this.updateTotal();
      if( this.ld.getItem('utimosDias') )
        this.utimosDias = this.ld.getItem('utimosDias')[0];
      else   
        this.utimosDias = 30; 
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.localList  = this.localList.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.precio.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.categoria.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.lugar.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      this.serverList = this.serverList.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.precio.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.categoria.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
               (item.lugar.toLowerCase().indexOf(val.toLowerCase()) > -1);

      });

      this.updateTotal();

    }

  }  

  updateTotal(){

    var total = 0;
    for (var index in this.localList) {
        var valor:number = 0;
        if( !isNaN(parseFloat(this.localList[index].precio)) ){
          valor= parseFloat(this.localList[index].precio);
          //console.log( 'valor: ' + valor );
          total = total + valor;
        }  
    }

    for (var index2 in this.serverList) {
        var valor2:number = 0;
        if( !isNaN(parseFloat(this.serverList[index2].precio)) ){
          valor2= parseFloat(this.serverList[index2].precio);
          //console.log( 'valor: ' + valor );
          total = total + valor2;
        }  
    }
    //console.log( total.toFixed(2) );

    this.total = total.toFixed(2); 

  }

  sincronizar(){
    this.navCtrl.push(SincPage);
  }

  //Nuevo , Copiar , Editar, Delete
  newG(){
    this.navCtrl.push(FormPage, {
        action: 'new'
      })
  }

  copy(item){
      this.navCtrl.push(FormPage, {
        item: item,
        action: 'copy'
      })
  }

  edit(item){
      this.navCtrl.push(FormPage, {
        item: item,
        action: 'edit'
      })
  }  

  del(item){
      this.navCtrl.push(FormPage, {
        item: item,
        action: 'del'
      })
  }    



  msgAction( item ) {
      //console.log(task.key)
      let confirm = this.alertCtrl.create({
        title: 'Que desea hacer?',
        buttons: [
          {
            text: 'Copiar',
            handler: () => {
              this.copy(item);
            }
          },
          {
            text: 'Editar',
            handler: () => {
              this.edit(item);
            }
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.del(item);
            }
          }
        ]
      });
      confirm.present();
  }

}
