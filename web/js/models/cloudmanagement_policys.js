define([
    'models/eucacollection',
    'models/cloudmanagement_policy'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.cloudmanagement.PolicyAction$query.json'
    });
});
