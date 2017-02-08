import Ember from 'ember';

export default Ember.Controller.extend({
	proyecto:{},
	sin_etapas:'',
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			var method = "GET";
			var url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/';
		    this.getElements(method,url,this.setProyecto,this);
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
	setProyecto(proyecto,context){
		var _this = context;
		_this.set('proyecto',proyecto);
		if (proyecto.etapas.length==0){
			_this.set('sin_etapas',true);
		}else{
			_this.set('sin_etapas',false);
		}
		//console.log(proyecto);
	},
	actions:{
		etapa:function(etapa){
			window.localStorage.setItem('codigo_eta',etapa.codigo_eta);
			this.transitionToRoute('etapa');
		},
	}
});
