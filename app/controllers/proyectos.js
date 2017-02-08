import Ember from 'ember';

export default Ember.Controller.extend({
	sin_proyectos:'',
	proyectos:[],
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
	llamadaServidor(method,url,data,callback,context){
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
			//console.log(response);
			context.init();
			callback('Exito: ',response.msg,1,context);
		})    
		.fail(function(response) { 
			console.log(response);
			callback('Error: ',response.responseText,-1,context);
		});
	},
	msgRespuesta(tipo,desc,estatus,context){
		var clases = ['alert-danger','alert-warning','alert-success'];
		var _this = context;
		_this.set('msg.tipo',tipo);
		_this.set('msg.desc',desc);
		$.each(clases,function(i/*,clase*/){
			if (i === (estatus+1)){
				$("#alertMsg").addClass(clases[i]);
			}else{
				$("#alertMsg").removeClass(clases[i]);
			}

		});
		$("#alertMsg").show();

	},
	setProyectos(proyectos,context){
		var _this = context;

		if (!Array.isArray(proyectos)){
			var aux = [];
			aux.push(proyectos);
			proyectos = aux;
		}
		if (proyectos.length==0){
			_this.set('sin_proyectos',true);
		}else{
			_this.set('sin_proyectos',false);
		}
		_this.set('proyectos',proyectos);
		console.log(proyectos);
	},
	actions:{
		proyecto:function(proyecto){
			window.localStorage.setItem('codigo_pro',proyecto.codigo);
			this.transitionToRoute('proyecto');
		}
	}
});
