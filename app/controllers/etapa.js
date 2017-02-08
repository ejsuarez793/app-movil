import Ember from 'ember';

export default Ember.Controller.extend({
	etapa:{},
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			var method = "GET";
			var url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' +window.localStorage.getItem('codigo_eta')+'/';
		    this.getElements(method,url,this.setEtapa,this);
		}
	},
	getElements(method,url,callback,context){
		$.ajax({
			type: method,
			url: url,
			headers:{
				Authorization: "Token "+ window.localStorage.getItem('token'),
			},
				contentType: "application/json; charset=utf-8",
				dataType: "json",
		})    
		.done(function(response){ callback(response, context); })    
		.fail(function(response) { console.log(response); }); 
	},
	setEtapa(etapa,context){
		var _this = context;
		_this.set('etapa',etapa);
		console.log(etapa);
	},
	actions:{
		etapa:function(etapa){
			window.localStorage.setItem('codigo_eta',etapa.codigo_eta);
			this.transitionToRoute('etapa');
		}
	}
});
