
export class LocalData {
    private update:Boolean;
    private localList:Array<any> = [];
    private serverList:Array<any> = [];
    private categoriasList:Array<any> = [];
    private lugaresList:Array<any> = [];
    private monedasList:Array<any> = [];

    constructor() {

    }

    getItem(name:string , reverse:boolean = false){     
        if(reverse)
            return JSON.parse(localStorage.getItem( name )).reverse();
        else
            return JSON.parse(localStorage.getItem( name ));
    }

    setItem(name:string, value:Array<any>){
        localStorage.setItem( name , JSON.stringify( value ) );
    }

    // update
    setUpdate(update) {
        this.update = update;
    }
    getUpdate() {
        return this.update;
    }

    updateLocalList(){
	    this.localList = [];
	    if(this.getItem('local'))
	      this.localList = this.getItem('local' , true);
    }

    updateServerList(){
	    this.serverList = [];
        if(this.getItem('server'))
          this.serverList = this.getItem('server' , true);
    }   

    updateCategoriasList(){
	    this.categoriasList = [];
        if(this.getItem('categorias'))
          this.categoriasList = this.getItem('categorias' , true);      
    }      

    updateLugaresList(){
        this.lugaresList = [];
        if(this.getItem('lugar'))
          this.lugaresList = this.getItem('lugar');      
    }      

    updateMonedasList(){
        this.monedasList = [];
        if(this.getItem('monedas'))
          this.monedasList = this.getItem('monedas');      
    }          

    /* ordena Array */
    sortDateFunction(a,b){  
        //var dateA = new Date(a.fecha).getTime();
        //var dateB = new Date(b.fecha).getTime();
        return a.fecha < b.fecha ? 1 : -1;  
    }; 

    sortNombreFunction(a,b){  
        var nameA=a.nombre.toLowerCase(), nameB=b.nombre.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    };

    sortFunction(a,b){  
        var nameA=a.toLowerCase(), nameB=b.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    };    

    /* ordena Array */    


    setItemLugar(lugar:string){

        lugar = lugar.trim(); 

        this.lugaresList = [];     
        if(this.getItem('lugar'))
            this.lugaresList = this.getItem('lugar');           

        if (this.lugaresList.indexOf( lugar ) === -1){
            this.lugaresList.push( lugar ); 
            this.setItem('lugar', this.lugaresList );
        }

    }  

    getLocalList(){
	    return this.localList.sort(this.sortDateFunction);
    }

    getSeverList(){
	    return this.serverList.sort(this.sortDateFunction);
    }

    getCategoriasList(){
		return this.categoriasList.sort(this.sortNombreFunction);
    }  

    getILugaresList(){
        return this.lugaresList.sort(this.sortFunction);
    }

    getMonedasList(){
        return this.monedasList.sort(this.sortFunction);
    }   


    // abm
    addGasto(
      nombre,
      precio,
      categoria,
      metodo,
      fecha,
      lugar,
      descripcion,
      key,
      action
    ){


        var arrayObj = {
            nombre:nombre,
            categoria:categoria,
            metodo:metodo,
            precio:precio,
            fecha:fecha,
            lugar:lugar,
            descripcion:descripcion,
            key:key,
            action:action
        }; 

        //seto lugar 
        var localObj = new Array;
        this.setItemLugar(lugar);
        localObj = this.getItem('local');

        if( ! localObj )
        localObj = [];

        localObj.push(arrayObj);
        this.setItem('local' , localObj );


    }

    editGasto(
      nombre,
      precio,
      categoria,
      metodo,
      fecha,
      lugar,
      descripcion,
      key,
      action
    ){

        var arrayObj = {
            nombre:nombre,
            precio:precio,
            categoria:categoria,
            metodo:metodo,
            fecha:fecha,
            lugar:lugar,
            descripcion:descripcion,
            key:key,
            action:action
        }; 

        //seto lugar 
        var list = new Array;
        this.setItemLugar(lugar);
        var index;
        var listName


        if( key.indexOf('local') > -1 )
            listName = 'local';
        else
            listName = 'server';


        list = this.getItem(listName);
        if(this.getPosByKey(key, listName) !== false){
            index = Number(this.getPosByKey(key, listName));
            list[ index ] = arrayObj;    
            this.setItem( listName , list );   
        }

    }


    getPosByKey( key , nameList ){
        var list = new Array();
        list = this.getItem(nameList);
        for(var i = 0; i<list.length; i++){
            if( list[i].key == key )
                return i;
        }
        return false;
    }


    delGasto(key){
        var listName;
        if( key.indexOf('local') > -1 )
            listName = 'local';
        else
            listName = 'server';

        var list = new Array;
        var index;
        list = this.getItem(listName);
        if(this.getPosByKey(key, listName) !== false){
            index = Number(this.getPosByKey(key, listName));
            if(listName == 'local')
                list.splice( index , 1); // si es local lo borro
            else
                list[ index ].action = 'del';   // si es del servidor lo marco 
            this.setItem( listName , list );   
        }

    }    




}