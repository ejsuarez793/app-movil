import Ember from 'ember';

export default Ember.Controller.extend({
	currentName:'',
	proyectos: [],
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			/*var method = "GET";
			var url = window.serverUrl + '/tecnico/proyectos/' + window.localStorage.getItem('ci') + '/';
		    this.getElements(method,url,this.setProyectos,this);*/
		}
	},
	/*getElements(method,url,callback,context){
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
	setProyectos(proyectos,context){
		var _this = context;

		if (!Array.isArray(proyectos)){
			var aux = [];
			aux.push(proyectos);
			proyectos = aux;
		}
		_this.set('proyectos',proyectos);
	},*/
	actions:{
		solicitudes:function(){
			this.transitionToRoute('solicitudes');
			//console.log("solicitude");
		},
		proyectos:function(){
			this.transitionToRoute('proyectos');
			//console.log("proyectos");
		},
	}
});
