import Ember from 'ember';

export default Ember.Controller.extend({
	etapa:{},
	msg:{},
	reporte_detalle:{},
	reporte:{},
	init(){
		this._super();
		if (!((window.localStorage.getItem('token')===undefined) || (window.localStorage.getItem('nombre1')===undefined))){
			this.set('currentName', window.localStorage.getItem('nombre1') + " " +window.localStorage.getItem('apellido1'));

			var method = "GET";
			var url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' +window.localStorage.getItem('codigo_eta')+'/';
		    this.getElements(method,url,this.setEtapa,this);
		}

		//agregamos esta funcion, para que cada vez que le demos al boton back elimine las clases  que el modal agrega a la pagina
		//y que no se quede el 'backdrop' para siempre.
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
	validarReporte(){
		$.validator.addMethod("maxlength", function (value, element, len) {
				return value === "" || value.length <= len;
		});

		$("#formulario_rep").validate({
			rules:{
				tipo:{
					required:true,
				},
				observ:{
					required:true,
					maxlength:300,
				},

			},
			messages:{
				tipo:{
					required:'Este campo es requerido.',
				},
				observ:{
					required:'Este campo es requerido.',
					maxlength:'Longitud máxima de 300 caracteres.',
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
		url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' + window.localStorage.getItem('codigo_eta') +'/reporteDetalle/';
		this.validarReporteDetalle();
        if ($("#formulario_rd").valid()){
        	this.llamadaServidor(method,url,data,this.msgRespuesta,this);
        	$("#myModalReporteDetalle").modal('hide');
        }
		
	},
	guardarActividades(){
		var method = "PATCH";
		var url;
		var data = {};
		data = [];
		var checkbox = "#modalBodyActividades input:checked";
		var actividades = this.get('etapa.actividades').toArray();

		$(checkbox).each(function() {
		    //console.log($(this).val());
		    var _this = this;
		    $.each(actividades,function(i,actividad){
		    	if (actividad.codigo === parseInt($(_this).val() )) {
		    		data.push($.extend(true,{},actividad));
		    	}
		    });
		});
		url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' + window.localStorage.getItem('codigo_eta') +'/actividad/';
        if (data.length > 0){
        	this.llamadaServidor(method,url,data,this.msgRespuesta,this);
        }else{
        	this.msgRespuesta("Error ","No seleccionaste ninguna actividad para completar.",-1,this);
        }
        $("#myModalActividades").modal('hide');
        console.log(data);
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
			$("#myModalReporteDetalle").modal('show');
		},
		openModalActividades(){
			$("#myModalActividades").modal('show');
		},
		openModalSolicitudMateriales(){

			$("#myModalSolicitudMateriales").modal('show');
			var elementos = $.extend(true,[],this.get('etapa.materiales').toArray());

			// ahora cada elemento lo inicializamos para no ser mostrado como seleccionado inicialmente
			//sino que aparece sin seleccion
			$.each(elementos,function(i,elemento){
				elemento['cantidad_seleccion'] = 0;
				elemento['cantidad_sin_seleccion'] = elemento['cantidad'];
				elemento['mostrar_seleccion'] = false;
				elemento['mostrar_sin_seleccion'] = true;
			});
			this.set('material',true);
			this.set('servicio',false);
			this.set('disponibles',elementos);
		},
		guardarSolicitudMateriales(){
			var method = "POST";
			var url;
			var data = {};
			var disponibles = this.get('disponibles').toArray();
			//var materiales = [];
			var aux={};
			data.ci_tecnico = window.localStorage.getItem('ci');
			//data.codigo_eta = window.localStorage.getItem('codigo_eta');
			data.materiales = [];

			$.each(disponibles,function(i,disponible){
				if (disponible.mostrar_seleccion){
					aux.codigo = disponible.codigo;
					aux.cantidad = disponible.cantidad_seleccion;
					data.materiales.push($.extend(true,{},aux));
				}
			});
			//console.log(data);
			url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' + window.localStorage.getItem('codigo_eta') +'/solicitud/';
	        if (data.materiales.length > 0){
	        	this.llamadaServidor(method,url,data,this.msgRespuesta,this);
	        	
	        }else{
	        	this.msgRespuesta("Error ","No seleccionaste ningún material",-1,this);
	        }
	        $("#myModalSolicitudMateriales").modal('hide');
		},
		agregarSeleccion(){
			var checkbox = "#myModalAgregar input:checked";
			var disponibles = $.extend(true,[],this.get('disponibles').toArray());
			var input_cantidad = "#cant_sel_";

			//por cada elemento que esta seleccionado
			$(checkbox).each(function() {
		    	var codigo = $(this).val();
				$.each(disponibles,function(i,disponible){
					if(codigo === disponible.codigo){ //si el codigo del checkbox es igual al del elemento
						var cantidad = parseInt($(input_cantidad+codigo).val()); //agarramos la cantidad seleccionada
						if (!isNaN(cantidad) && cantidad <= disponible.cantidad_sin_seleccion){//si es un numero y es menor que la cantidad disponible
							disponible.cantidad_seleccion += cantidad;
							disponible.cantidad_sin_seleccion -= cantidad;
							if (disponible.cantidad_sin_seleccion === 0 ){
								disponible.mostrar_sin_seleccion = false;
							}
							if(disponible.cantidad_seleccion > 0 ){
								disponible.mostrar_seleccion = true;
							}
						}
					}
				});
			});


			this.set('disponibles',disponibles);
			$('#myModalAgregar').modal('hide');
		},
		eliminarSeleccion(){
			var checkbox;
			var disponibles = $.extend(true,[],this.get('disponibles').toArray());
			var codigo;

			if (this.get('material')){
				checkbox = "#myModalSolicitudMateriales input:checked";
			}else if (this.get('servicio')){
				checkbox = "#myModalReportes input:checked";
			}

			$(checkbox).each(function() {
				codigo = $(this).val();
				$.each(disponibles,function(i,disponible){
					if(codigo === disponible.codigo){
						disponible.cantidad_seleccion = 0 ;
						disponible.cantidad_sin_seleccion = disponible.cantidad;
						disponible.mostrar_seleccion = false;
						disponible.mostrar_sin_seleccion = true;
					}
				});
			});
			this.set('disponibles',disponibles);
		},
		openModalReporte(){
			$("#myModalReportes").modal('show');
			var elementos = $.extend(true,[],this.get('etapa.servicios').toArray());

			// ahora cada elemento lo inicializamos para no ser mostrado como seleccionado inicialmente
			//sino que aparece sin seleccion
			$.each(elementos,function(i,elemento){
				elemento['cantidad_seleccion'] = 0;
				elemento['cantidad_sin_seleccion'] = elemento['cantidad'];
				elemento['mostrar_seleccion'] = false;
				elemento['mostrar_sin_seleccion'] = true;
			});
			this.set('material',false);
			this.set('servicio',true);
			this.set('disponibles',elementos);
		},
		guardarReporte(){
			var method = "POST";
			var url;
			var data = {};
			var disponibles = this.get('disponibles').toArray();
			var aux={};
			data.nombre_t = window.localStorage.getItem('nombre1') + " " + window.localStorage.getItem('apellido1');
			data.tipo = this.get('reporte.tipo');
			data.observ = this.get('reporte.observ');
			data.codigo_eta = window.localStorage.getItem('codigo_eta');
			data.servicios = [];

			$.each(disponibles,function(i,disponible){
				if (disponible.mostrar_seleccion){
					aux.codigo = disponible.codigo;
					aux.cantidad = disponible.cantidad_seleccion;
					data.servicios.push($.extend(true,{},aux));
				}
			});
			//console.log(data);
			url = window.serverUrl + '/tecnico/proyecto/' + window.localStorage.getItem('codigo_pro') + '/etapa/' + window.localStorage.getItem('codigo_eta') +'/reporte/';
			this.validarReporte();
	        if ($("#formulario_rep").valid()){
	        	if (data.tipo !== "Avance" && data.servicios.length > 0){
	        		this.msgRespuesta("Error ","Solo los reportes de tipo 'avance' pueden contener servicios.",-1,this);
	        	}else{
	        		this.llamadaServidor(method,url,data,this.msgRespuesta,this);
	        	}
	        	$("#myModalReportes").modal('hide');
	        }
	        
		},
		selectReporte(){
			this.set('reporte.tipo',$("#select_tipo_reporte").val());
		},
		openModalAgregar(){
			$("#myModalAgregar").modal('show');
		},
		guardarReporteDetalle(){
			this.guardarReporteDetalle();
		},
		guardarActividades(){
			this.guardarActividades();
		}
	}
});
