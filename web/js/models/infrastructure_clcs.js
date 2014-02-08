define([
    'models/eucacollection',
    'models/infrastructure_clc'
], function(EucaCollection, Controller) {
    return EucaCollection.extend({
	model: Controller,
	url: 'ea.cloud.CloudComponentsAction$queryControllers.json'
    });
});