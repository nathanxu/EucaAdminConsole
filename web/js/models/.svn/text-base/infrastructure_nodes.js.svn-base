define([
    'models/eucacollection',
    'models/infrastructure_node'
], function(EucaCollection, Node) {
    var collection = EucaCollection.extend({
      model: Node,
      url: 'ea.node.NodeAction$queryNodes.json'
    });
    return collection;
});
