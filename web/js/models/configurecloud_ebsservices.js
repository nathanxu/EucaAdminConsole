define([
    'models/eucacollection',
    'models/configurecloud_ebsservice'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.configurecloud.EbsserviceAction$query.json'
    });
});
