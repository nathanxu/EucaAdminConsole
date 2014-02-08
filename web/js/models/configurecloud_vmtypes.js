define([
    'models/eucacollection',
    'models/configurecloud_vmtype'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.configurecloud.VmtypeAction$query.json'
    });
});
