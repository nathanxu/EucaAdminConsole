define([
    'models/eucacollection',
    'models/infrastructure_storage'
], function(EucaCollection, Storage) {
    var collection = EucaCollection.extend({
      model: Storage,
      url: 'ea.cluster.StorageAction$queryStorages.json'
    });
    return collection;
});
