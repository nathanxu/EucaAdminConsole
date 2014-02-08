define([
    'models/eucacollection',
    'models/infrastructure_sc'
], function(EucaCollection, Storagecontroller) {
    var collection = EucaCollection.extend({
      model: Storagecontroller,
      url: 'ea.cluster.ClusterAction$queryStoragecontrollers.json'
    });
    return collection;
});
