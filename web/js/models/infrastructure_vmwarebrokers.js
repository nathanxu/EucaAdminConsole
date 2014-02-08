define([
    'models/eucacollection',
    'models/infrastructure_vmwarebroker'
], function(EucaCollection, Vmwarebroker) {
    var collection = EucaCollection.extend({
      model: Vmwarebroker,
      url: 'ea.cluster.ClusterAction$queryVmwarebrokers.json'
    });
    return collection;
});
