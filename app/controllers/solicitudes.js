import Ember from 'ember';

export default Ember.Controller.extend({
	sin_solicitudes:'',
	reporte_inicial:{},
	msg:{},
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			var method = "GET";
			var url = window.serverUrl + '/tecnico/solicitudes/' + window.localStorage.getItem('ci') + '/';
		    this.getElements(method,url,this.setSolicitudes,this);
		}
		$(window).on('popstate', function() {
		  $('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		});
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
	setSolicitudes(solicitudes,context){
		var _this = context;

		if (!Array.isArray(solicitudes)){
			var aux = [];
			aux.push(solicitudes);
			solicitudes = aux;
		}
		if (solicitudes.length==0){
			_this.set('sin_solicitudes',true);
		}else{
			_this.set('sin_solicitudes',false);
		}
		_this.set('solicitudes',solicitudes);
	},
	validarReporteInicial(){
		$.validator.addMethod("maxlength", function (value, element, len) {
				return value === "" || value.length <= len;
		});

		$("#formulario_ri").validate({
			rules:{
				persona_a:{
					required:true,
					maxlength:60,
				},
				cargo_a:{
					required:true,
					maxlength:60,
				},
				desc:{
					required:true,
					maxlength:500,
				},
				observ:{
					required:true,
					maxlength:500,
				},
				riesgos:{
					required:true,
					maxlength:300,
				},
				factibilidad:{
					required:true,
				},
				complejidad:{
					required:true,
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
				desc:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 500 caracteres.',
				},
				observ:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 500 caracteres.',
				},
				riesgos:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 300 caracteres.',
				},
				factibilidad:{
					required:'Este campo es requerido.',
				},
				complejidad:{
					required:'Este campo es requerido.',
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
	guardarReporteInicial(){
		var method = "POST";
		var url;
		var data = {};
		console.log(this.get('reporte_inicial'));
		$.extend(true,data,this.get('reporte_inicial'));
		data.f_vis = moment().format("YYYY-MM-DD");
		data.completado = true;
		data.nombre_t = window.localStorage.getItem('nombre1') + " " + window.localStorage.getItem('apellido1');

		url = window.serverUrl + '/tecnico/proyecto/' + this.get('solicitud.codigo_pro') + '/reporteInicial/';
		this.validarReporteInicial();
        if ($("#formulario_ri").valid()){
        	this.llamadaServidor(method,url,data,this.msgRespuesta,this);
        	$("#myModalSolicitud").modal('hide');
        }
		
	},
	cerrarMsg(){
		$("#alertMsg").hide();
	},
	actions:{
		cerrarMsg:function(){
			this.cerrarMsg();
		},
		openModalSolicitud:function(solicitud){
			$('#myModalSolicitud').modal('show');
			this.set('solicitud',solicitud);
		},
		selectComplejidad:function(){
			this.set('reporte_inicial.complejidad',$("#select_complejidad").val());
		},
		selectFactibilidad:function(){
			this.set('reporte_inicial.factibilidad',$("#select_factibilidad").val())
		},
		guardarReporteInicial:function(){
			this.guardarReporteInicial();
		}
	}
});
