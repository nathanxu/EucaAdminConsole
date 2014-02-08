define([
    'app',
    'views/searches/generic',
    'views/searches/tagsearch'
], function(app, Search, TagSearch) {
  return function(balancer) {
    var config = {
      facets : ['all_text'],
      localize: {
        all_text: app.msg('search_facet_alltext')
      }
    }
    return new Search(balancer, new TagSearch(config, balancer));
  }
});
