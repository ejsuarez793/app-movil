import Ember from 'ember';

export default Ember.Controller.extend({
	currentName:'',
	proyectos: [],
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			var method = "GET";
			var url = window.serverUrl + '/tecnico/proyectos/' + window.localStorage.getItem('ci') + '/';
		    this.getElements(method,url,this.setProyectos,this);
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
	/*llamadaServidor(method,url,data){
		$.ajax({
			type: method,
			url: url,
			context: this,
			headers:{
				Authorization: "Token "+ window.localStorage.getItem('token'),
			},
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(data),
		})    
		.done(function(response) { 
			this.msgRespuesta('Exito: ',response.msg,1,this); 
			this.init(); 
		})    
		.fail(function(response) { 
			console.log(response); 
			this.msgRespuesta('Error: ',response.responseText,-1,this);
		});
	},*/
	/*msgRespuesta(tipo,desc,estatus,context){
		var clases = ['alert-danger','alert-warning','alert-success'];
		var _this = context;
		_this.set('msg.tipo',tipo);
		_this.set('msg.desc',desc);
		$.each(clases,function(i){
			if (i === (estatus+1)){
				$("#alertMsg").addClass(clases[i]);
			}else{
				$("#alertMsg").removeClass(clases[i]);
			}

		});
		$("#alertMsg").show();

	},*/
	setProyectos(proyectos,context){
		var _this = context;

		if (!Array.isArray(proyectos)){
			var aux = [];
			aux.push(proyectos);
			proyectos = aux;
		}
		_this.set('proyectos',proyectos);
	},
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
