define([
    'models/eucacollection',
    'models/cloudmanagement_s3report'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.cloudmanagement.S3ReportAction$query.json'
    });
});
