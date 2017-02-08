import Ember from 'ember';

export default Ember.Controller.extend({
	etapa:{},
	msg:{},
	reporte_detalle:{},
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
	validarReporteDetalle(){
		$.validator.addMethod("maxlength", function (value, element, len) {
				return value === "" || value.length <= len;
		});

		$("#formulario_rd").validate({
			rules:{
				persona_a:{
					required:true,
					maxlength:60,
				},
				cargo_a:{
					required:true,
					maxlength:60,
				},
				observ:{
					required:true,
					maxlength:500,
				},
				vicios_ocu:{
					required:true,
					maxlength:300,
				},

			},
			messages:{
				persona_a:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 60 caracteres.',
				},
				cargo_a:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 60 caracteres.',
				},
				observ:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 500 caracteres.',
				},
				vicios_ocu:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 500 caracteres.',
				},
			},
			errorElement: 'small',
			errorClass: 'help-block',
			errorPlacement: function(error, element) {
				error.insertAfter(element.parent());
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).addClass('valid').closest('.form-group').removeClass('has-error').addClass('has-success');
			}
		});
	},
	guardarReporteDetalle(){
		var method = "POST";
		var url;
		var data = {};
		$.extend(true,data,this.get('reporte_detalle'));
		data.completado = true;
		data.nombre_t = window.localStorage.getItem('nombre1') + " " + window.localStorage.getItem('apellido1');
		//console.log(data);
		url = window.serverUrl + '/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' + window.localStorage.getItem('codigo_eta') +'/reporteDetalle/';
		this.validarReporteDetalle();
        if ($("#formulario_rd").valid()){
        	this.llamadaServidor(method,url,data,this.msgRespuesta,this);
        	$("#myModalReporteDetalle").modal('hide');
        }
		
	},
	cerrarMsg(){
		$("#alertMsg").hide();
	},
	actions:{
		cerrarMsg:function(){
			this.cerrarMsg();
		},
		etapa:function(etapa){
			window.localStorage.setItem('codigo_eta',etapa.codigo_eta);
			this.transitionToRoute('etapa');
		},
		openModalReporteDetalle(){
			console.log("implementar rd");
			$("#myModalReporteDetalle").modal('show');
		},
		openModalActividades(){
			console.log("implementar act");
			$("#myModalActividades").modal('show');
		},
		openModalSolicitudMateriales(){
			console.log("implementar solicitud");
		},
		openModalReporte(){
			console.log("implementar reporte");
		},
		guardarReporteDetalle(){
			this.guardarReporteDetalle();
		}
	}
});
