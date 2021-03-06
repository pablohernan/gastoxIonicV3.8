import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrencyConvert {
 
  constructor(public http: Http) {
  
  }


/* params 
Api 

KEY
ab4cbafe9fb9108d5eeb045717d87b91


pablohernanarg@gmail.com
pablo123



AFA-Afghanistan Afghani
ALL-Albanian Lek
DZD-Algerian Dinar
ARS-Argentine Peso
AWG-Aruba Florin
AUD-Australian Dollar
BSD-Bahamian Dollar
BHD-Bahraini Dinar
BDT-Bangladesh Taka
BBD-Barbados Dollar
BZD-Belize Dollar
BMD-Bermuda Dollar
BTN-Bhutan Ngultrum
BOB-Bolivian Boliviano
BWP-Botswana Pula
BRL-Brazilian Real
GBP-British Pound
BND-Brunei Dollar
BIF-Burundi Franc
XOF-CFA Franc (BCEAO)
XAF-CFA Franc (BEAC)
KHR-Cambodia Riel
CAD-Canadian Dollar
CVE-Cape Verde Escudo
KYD-Cayman Islands Dollar
CLP-Chilean Peso
CNY-Chinese Yuan
COP-Colombian Peso
KMF-Comoros Franc
CRC-Costa Rica Colon
HRK-Croatian Kuna
CUP-Cuban Peso
CYP-Cyprus Pound
CZK-Czech Koruna
DKK-Danish Krone
DJF-Dijibouti Franc
DOP-Dominican Peso
XCD-East Caribbean Dollar
EGP-Egyptian Pound
SVC-El Salvador Colon
EEK-Estonian Kroon
ETB-Ethiopian Birr
EUR-Euro
FKP-Falkland Islands Pound
GMD-Gambian Dalasi
GHC-Ghanian Cedi
GIP-Gibraltar Pound
XAU-Gold Ounces
GTQ-Guatemala Quetzal
GNF-Guinea Franc
GYD-Guyana Dollar
HTG-Haiti Gourde
HNL-Honduras Lempira
HKD-Hong Kong Dollar
HUF-Hungarian Forint
ISK-Iceland Krona
INR-Indian Rupee
IDR-Indonesian Rupiah
IQD-Iraqi Dinar
ILS-Israeli Shekel
JMD-Jamaican Dollar
JPY-Japanese Yen
JOD-Jordanian Dinar
KZT-Kazakhstan Tenge
KES-Kenyan Shilling
KRW-Korean Won
KWD-Kuwaiti Dinar
LAK-Lao Kip
LVL-Latvian Lat
LBP-Lebanese Pound
LSL-Lesotho Loti
LRD-Liberian Dollar
LYD-Libyan Dinar
LTL-Lithuanian Lita
MOP-Macau Pataca
MKD-Macedonian Denar
MGF-Malagasy Franc
MWK-Malawi Kwacha
MYR-Malaysian Ringgit
MVR-Maldives Rufiyaa
MTL-Maltese Lira
MRO-Mauritania Ougulya
MUR-Mauritius Rupee
MXN-Mexican Peso
MDL-Moldovan Leu
MNT-Mongolian Tugrik
MAD-Moroccan Dirham
MZM-Mozambique Metical
MMK-Myanmar Kyat
NAD-Namibian Dollar
NPR-Nepalese Rupee
ANG-Neth Antilles Guilder
NZD-New Zealand Dollar
NIO-Nicaragua Cordoba
NGN-Nigerian Naira
KPW-North Korean Won
NOK-Norwegian Krone
OMR-Omani Rial
XPF-Pacific Franc
PKR-Pakistani Rupee
XPD-Palladium Ounces
PAB-Panama Balboa
PGK-Papua New Guinea Kina
PYG-Paraguayan Guarani
PEN-Peruvian Nuevo Sol
PHP-Philippine Peso
XPT-Platinum Ounces
PLN-Polish Zloty
QAR-Qatar Rial
ROL-Romanian Leu
RUB-Russian Rouble
WST-Samoa Tala
STD-Sao Tome Dobra
SAR-Saudi Arabian Riyal
SCR-Seychelles Rupee
SLL-Sierra Leone Leone
XAG-Silver Ounces
SGD-Singapore Dollar
SKK-Slovak Koruna
SIT-Slovenian Tolar
SBD-Solomon Islands Dollar
SOS-Somali Shilling
ZAR-South African Rand
LKR-Sri Lanka Rupee
SHP-St Helena Pound
SDD-Sudanese Dinar
SRG-Surinam Guilder
SZL-Swaziland Lilageni
SEK-Swedish Krona
TRY-Turkey Lira
CHF-Swiss Franc
SYP-Syrian Pound
TWD-Taiwan Dollar
TZS-Tanzanian Shilling
THB-Thai Baht
TOP-Tonga Pa'anga
TTD-Trinidad&amp;Tobago Dollar
TND-Tunisian Dinar
TRL-Turkish Lira
USD-U.S. Dollar
AED-UAE Dirham
UGX-Ugandan Shilling
UAH-Ukraine Hryvnia
UYU-Uruguayan New Peso
VUV-Vanuatu Vatu
VEB-Venezuelan Bolivar
VND-Vietnam Dong
YER-Yemen Riyal
YUM-Yugoslav Dinar
ZMK-Zambian Kwacha
ZWD-Zimbabwe Dollar

*/

  private data:any;
  getConvert( from:string , to:string , callBackFn:Function){
    if(this.data){
          this.setData(this.data ,from , to , callBackFn);
    }else{ // llamo el servicio solo una vez , despues consumo los datos retornados
      
      this.http.get('http://data.fixer.io/api/latest?access_key=ab4cbafe9fb9108d5eeb045717d87b91').subscribe(data => {  
      //this.http.get('https://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json').subscribe(data => {       
          this.data = data;
          this.setData(data ,from , to , callBackFn);
      }); 
    }
  }

  setData(data:any ,from:string , to:string , callBackFn:Function){
      var precioToFrom = '0';
      var res = JSON.parse(data._body).rates;
      /*
      var res = data.json().list.resources;
      for(var i=0; i<res.length; i++){
        if(res[i].resource.fields.name == to+'/'+from)
          precioToFrom = res[i].resource.fields.price;
      }
      */

      precioToFrom = eval('res.'+from); //novo
      precioToFrom = String(parseFloat(precioToFrom)/res.USD);

      console.log('from: ' +from+ ' - to :' + to + ' - ' + precioToFrom);
      var precioFromTo = 1 / parseFloat(precioToFrom);

      callBackFn( precioFromTo , from , to );      
  }


  // recibe moneda local
  getValueConvert( curr:string , value:number){
    var cambio = JSON.parse(localStorage.getItem( 'cambio' ))
    var retArray = cambio.filter((item) => {
      return (item.from == curr);
    });
    return retArray[0].value * value; // return precio en dolares
  }  

  //recibe dolares
  getValueConvertInver( curr:string , value:number){
    var cambio = JSON.parse(localStorage.getItem( 'cambio' ))
    var retArray = cambio.filter((item) => {
      return (item.from == curr);
    });
    /*
    0,45 usd = 1 peso;
    x usd = x usd * 1 peso / 0,45 usd = x pesos
    */
    return  value / retArray[0].value; // return precio en curr 
  }   

}