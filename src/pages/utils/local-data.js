var LocalData = /** @class */ (function () {
    function LocalData() {
        this.localList = [];
        this.serverList = [];
        this.categoriasList = [];
        this.lugaresList = [];
        this.monedasList = [];
    }
    LocalData.prototype.getItem = function (name, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (reverse)
            return JSON.parse(localStorage.getItem(name)).reverse();
        else
            return JSON.parse(localStorage.getItem(name));
    };
    LocalData.prototype.setItem = function (name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    };
    // update
    LocalData.prototype.setUpdate = function (update) {
        this.update = update;
    };
    LocalData.prototype.getUpdate = function () {
        return this.update;
    };
    LocalData.prototype.updateLocalList = function () {
        this.localList = [];
        if (this.getItem('local'))
            this.localList = this.getItem('local', true);
    };
    LocalData.prototype.updateServerList = function () {
        this.serverList = [];
        if (this.getItem('server'))
            this.serverList = this.getItem('server', true);
    };
    LocalData.prototype.updateCategoriasList = function () {
        this.categoriasList = [];
        if (this.getItem('categorias'))
            this.categoriasList = this.getItem('categorias', true);
    };
    LocalData.prototype.updateLugaresList = function () {
        this.lugaresList = [];
        if (this.getItem('lugar'))
            this.lugaresList = this.getItem('lugar');
    };
    LocalData.prototype.updateMonedasList = function () {
        this.monedasList = [];
        if (this.getItem('monedas'))
            this.monedasList = this.getItem('monedas');
    };
    /* ordena Array */
    LocalData.prototype.sortDateFunction = function (a, b) {
        //var dateA = new Date(a.fecha).getTime();
        //var dateB = new Date(b.fecha).getTime();
        return a.fecha < b.fecha ? 1 : -1;
    };
    ;
    LocalData.prototype.sortNombreFunction = function (a, b) {
        var nameA = a.nombre.toLowerCase(), nameB = b.nombre.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    };
    ;
    LocalData.prototype.sortFunction = function (a, b) {
        var nameA = a.toLowerCase(), nameB = b.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    };
    ;
    /* ordena Array */
    LocalData.prototype.setItemLugar = function (lugar) {
        lugar = lugar.trim();
        this.lugaresList = [];
        if (this.getItem('lugar'))
            this.lugaresList = this.getItem('lugar');
        if (this.lugaresList.indexOf(lugar) === -1) {
            this.lugaresList.push(lugar);
            this.setItem('lugar', this.lugaresList);
        }
    };
    LocalData.prototype.getLocalList = function () {
        return this.localList.sort(this.sortDateFunction);
    };
    LocalData.prototype.getSeverList = function () {
        return this.serverList.sort(this.sortDateFunction);
    };
    LocalData.prototype.getCategoriasList = function () {
        return this.categoriasList.sort(this.sortNombreFunction);
    };
    LocalData.prototype.getILugaresList = function () {
        return this.lugaresList.sort(this.sortFunction);
    };
    LocalData.prototype.getMonedasList = function () {
        return this.monedasList.sort(this.sortFunction);
    };
    return LocalData;
}());
export { LocalData };
//# sourceMappingURL=local-data.js.map