import Ember from 'ember';

export default Ember.Controller.extend({
    msg: {},
    username:'',
    password:'',

    validarCampos: function(){

        $("#loginForm").validate(
            {
                rules: {
                    usuario:{
                        required:true,
                        nowhitespace: true,
                    },
                    clave:{
                        required: true,
                    },
                },
                messages:{
                    usuario:{
                        required:'Este campo es requerido.',
                        nowhitespace: 'Sin espacios en blanco.',
                },
                    clave:{
                        required: 'Este campo es requerido.',
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
    getCurrent(){
        var url = window.serverUrl + '/users/current/';
        var method = "GET";

         $.ajax( {
            type: method,
            context:this,
            url: url,
            headers:{
                Authorization: "Token "+ window.localStorage.getItem('token'),
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        })    
        .done(function(response) { 
            //Cookies.set("current", response);
            //console.log(response);
            window.localStorage.setItem('nombre1',response.nombre1);
            window.localStorage.setItem('nombre2',response.nombre2);
            window.localStorage.setItem('apellido1',response.apellido1);
            window.localStorage.setItem('apellido2',response.apellido2);
            window.localStorage.setItem('cargo',response.cargo);
            window.localStorage.setItem('ci',response.ci);
            window.localStorage.setItem('usuario',response.usuario);
            if(response.cargo !== 't'){
                this.msgRespuesta("Error: ","El usuario no es un técnico",-1,context);
            }else{
            	 this.transitionToRoute('/tecnico/');
            }
            document.getElementById("loginForm").reset();
        })    
        .fail(function(response) { console.log(response); }); 

    },
    llamadaServidor(method,url,data,callback,context){
        $.ajax({
            type: method,
            url: url,
            context: this,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
        })    
        .done(function(response) {
            //console.log(response);
            var token = response.token;
           // Cookies.set("token", token);
            window.localStorage.setItem('token',token);
            context.getCurrent();
        })    
        .fail(function(response) { 
            console.log(response);
            if (response.responseText === '{"non_field_errors":["Unable to log in with provided credentials."]}'){
                 callback('Error: ',"No es posible logear con las credenciales suministradas.",-1,context);    
            }
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
    cerrarMsg(){
        $("#alertMsg").hide();
    },
    actions: {
        cerrarMsg:function(){
            this.cerrarMsg();
        },
    	login: function () {
            var data = {};
            var token = '';
            var username = this.get('username');
            var password = this.get('password');
            data.username = username;
            data.password = password;
            var method = "POST"
            var url = window.serverUrl + /api-token-auth/;
            this.validarCampos();
            if ($("#loginForm").valid()){
                this.llamadaServidor(method,url,data,this.msgRespuesta,this);
            }
        },
    }
});
