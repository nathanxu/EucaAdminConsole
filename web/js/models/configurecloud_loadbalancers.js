define([
    'models/eucacollection',
    'models/configurecloud_loadbalancer'
], function(EucaCollection, LoadBalancer) {
    var collection = EucaCollection.extend({
      model: LoadBalancer,
      url: 'ea.configurecloud.LoadbalancerAction$query.json'
    });
    return collection;
});
