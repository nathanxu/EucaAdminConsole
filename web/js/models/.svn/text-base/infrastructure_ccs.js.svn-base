define([
    'models/eucacollection',
    'models/infrastructure_cc'
], function(EucaCollection, Clustercontroller) {
    var collection = EucaCollection.extend({
      model: Clustercontroller,
      url: 'ea.cluster.ClusterAction$queryClustercontrollers.json'
    });
    return collection;
});
