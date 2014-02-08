define([
    'models/eucacollection',
    'models/infrastructure_walrus'
], function(EucaCollection, Walrus) {
    return EucaCollection.extend({
	model: Walrus,
	url: 'ea.cloud.CloudComponentsAction$queryWalruses.json'
    });
});