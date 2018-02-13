import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { LocalData } from '../utils/local-data';
import { DataUtils } from '../utils/data-utils';
import { CurrencyConvert } from '../utils/currency-convert';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-sinc',
  templateUrl: 'sinc.html',
  providers: [LocalData,DataUtils,CurrencyConvert]
})
export class SincPage {

	dbListCategorias:Observable<any[]>;
  dbListServer:Observable<any[]>;
  dbListMonedas:Observable<any[]>;
	dbListCategoriasRef:AngularFireList<any>;
  dbListServerRef:AngularFireList<any>;
  dbListMonedasRef:AngularFireList<any>; 
  loader:any;
  utimosDias:number;

  tasksRef: AngularFireList<any>;
  tasks: Observable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public database: AngularFireDatabase,
    public loadingCtrl: LoadingController, 
    public ld:LocalData , 
    public dUtils:DataUtils ,  
    public cc:CurrencyConvert 
    ) {    

    this.dbListCategorias = this.database.list('/gastox/datos/categorias').valueChanges();

    if( this.ld.getItem('utimosDias') )
      this.utimosDias = this.ld.getItem('utimosDias')[0];
    else   
      this.utimosDias = 30; 

  }


  localToServer(){

    this.abrirLoading();

    //var fireList = this.af.database.list('/gastox/datos/gastos');

    this.dbListServerRef = this.database.list('gastox/datos/gastos');
    this.dbListServer = this.dbListServerRef.valueChanges();

    // local
    var localArray = this.ld.getItem('local');// JSON.parse(localStorage.getItem('local'));
    if( localArray ){

      for( var i = 0  ; i < localArray.length ; i++){

        this.dbListServerRef.push({
          nombre: (localArray[i].nombre)?localArray[i].nombre:'',
          precio:(localArray[i].precio)?localArray[i].precio:'',
          categoria:(localArray[i].categoria)?localArray[i].categoria:'',
          fecha:(localArray[i].fecha)?localArray[i].fecha:'',
          lugar:(localArray[i].lugar)?localArray[i].lugar:'',
          descripcion:(localArray[i].descripcion)?localArray[i].descripcion:''
        }).then(function(ref) {
          //console.log(ref);
        }, function(error) {
          console.log("Error:", error);
        });
      }

    }


    // server
    var serverArray = this.ld.getItem('server');// JSON.parse(serverStorage.getItem('server'));
    if( serverArray ){

      for( var x = 0  ; x < serverArray.length ; x++){
        if(serverArray[x].action == 'del'){
          console.log('del : ' + serverArray[x].key);
          this.dbListServerRef.remove( serverArray[x].key );
        }
        if(serverArray[x].action == 'edit'){
          console.log('edit : ' + serverArray[x].key);
          console.log('nombre : ' + serverArray[x].nombre);
          
          this.dbListServerRef.update( serverArray[x].key,{
            nombre: (serverArray[x].nombre)?serverArray[x].nombre:'',
            precio:(serverArray[x].precio)?serverArray[x].precio:'',
            categoria:(serverArray[x].categoria)?serverArray[x].categoria:'',
            fecha:(serverArray[x].fecha)?serverArray[x].fecha:'',
            lugar:(serverArray[x].lugar)?serverArray[x].lugar:'',
            descripcion:(serverArray[x].descripcion)?serverArray[x].descripcion:''
          });          
        }



      }

    }


    this.categoriasToLocal();

  }

  categoriasToLocal(){

    var categoriasArray = [];
    var count:number = 0;


    this.dbListCategorias.subscribe().unsubscribe();
    this.dbListCategorias.subscribe(snapshots=>{
          
          snapshots.forEach(snapshot => {
            
            categoriasArray.push(snapshot);
            count++;
            if(snapshots.length == count ){
                
                this.ld.setItem('categorias' , [] );
                this.ld.setItem('categorias' , categoriasArray );

                this.monedasToLocal();

            }
            
          })
               
      })

  } 

  /* guardo la lista de monedas de la db localmente */
  monedasToLocal(){

    var monedasArray = [];
    var count:number = 0;


    this.dbListMonedasRef  = this.database.list('gastox/monedas');
    this.dbListMonedas = this.dbListMonedasRef.valueChanges();


    this.dbListMonedas.subscribe().unsubscribe();
    this.dbListMonedas.subscribe(snapshots=>{
          
          snapshots.forEach(snapshot => {
            
            monedasArray.push(snapshot);
            count++;
            if(snapshots.length == count ){
                
                this.ld.setItem('monedas' , [] );
                this.ld.setItem('monedas' , monedasArray );

                this.cambioToLocal();

            }
            
          })
          
      })

  }   


  cambioToLocal(){

    var monedasArray = this.ld.getItem('monedas');

    // init
    this.ld.setItem('cambio', [] );


    for(var i=0 ; i<monedasArray.length ; i++){


    this.cc.getConvert(  monedasArray[i].sigla , 'USD' ,
        function( value , from , to ){
           /* utilizo o localStorage directo y no this.ld por ser una llamada async , no reconoce this.ld */
           var mArray = JSON.parse(localStorage.getItem( 'cambio' ));
           mArray.push({'from':from , 'to':to , 'value':value });
           localStorage.setItem( 'cambio' , JSON.stringify( mArray ) );
        });
    }

    this.serverToLocal();

  }  

  serverToLocal(){

    var serverArray = [];
    var count:number = 0;
    var dataFilter = new Date();
    dataFilter.setDate(dataFilter.getDate() - this.utimosDias);
    var start:any = this.dUtils.dateToUnix(this.dUtils.dateToString(dataFilter));

    this.ld.setItem('utimosDias' , [this.utimosDias] );    

    this.dbListServer = this.database.list('gastox/datos/gastos', 
    ref => ref
            .orderByChild('fecha')
            .startAt(start) 
      )
      .snapshotChanges().map(actions => {
        return actions.map(action => ({ // add key in the array
         key: action.key, ...action.payload.val() 
       }));
      });

    this.dbListServer.subscribe().unsubscribe();
    this.dbListServer.subscribe(snapshots=>{
          
          if(snapshots.length==0){
              //localStorage.setItem('local', JSON.stringify([]) );
              //localStorage.setItem('server', JSON.stringify([]) );
              this.ld.setItem('local', [] );
              this.ld.setItem('server', [] );        
              this.navCtrl.pop();
              this.cerrar();
          }

          snapshots.forEach(snapshot => {
            //console.log(snapshot.key, snapshot.val());
            snapshot.action = 'server';
            serverArray.push(snapshot);

            // set lugar para el autocomplete
            this.ld.setItemLugar(snapshot.lugar);

            count++;

            
            if(snapshots.length == count ){    
            
                this.ld.setItem('local', [] );
                this.ld.setItem('server', [] );  
                this.ld.setItem('server', serverArray );     
                               
                this.navCtrl.pop();
                this.cerrar();
                
            }  
     
          });
          
      })

  }

  abrirLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Sincronizando..."
    });
    this.loader.present();
  }  

  cerrar(){
    this.loader.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SincPage');
  }

}

