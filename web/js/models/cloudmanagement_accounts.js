define([
    'models/eucacollection',
    'models/cloudmanagement_account'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.cloudmanagement.AccountAction$query.json'
    });
});
