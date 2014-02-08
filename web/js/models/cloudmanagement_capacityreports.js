define([
    'models/eucacollection',
    'models/cloudmanagement_capacityreport'
], function(EucaCollection, Model) {
    return EucaCollection.extend({
	model: Model,
	url: 'ea.cloudmanagement.CapacityReportAction$query.json'
    });
});
