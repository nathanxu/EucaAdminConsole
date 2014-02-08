define([
    'models/eucacollection',
    'models/cloudmanagement_credential'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.cloudmanagement.CredentialAction$query.json'
    });
});
