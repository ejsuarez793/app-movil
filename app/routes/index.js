import Ember from 'ember';

export default Ember.Route.extend({
	controllerName: 'login',
	setupController: function(controller, model) {
    	this._super(controller, model);
  	},
});
