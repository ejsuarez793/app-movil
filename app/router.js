import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('', function() {});
  this.route('index', { path: '/' }, function() {});
  this.route('login');
  this.route('tecnico');
  this.route('solicitudes');
  this.route('proyectos');
});

export default Router;
