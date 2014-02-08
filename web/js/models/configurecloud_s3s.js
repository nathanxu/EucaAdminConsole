define([
    'models/eucacollection',
    'models/configurecloud_s3'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.configurecloud.S3Action$query.json'
    });
});
