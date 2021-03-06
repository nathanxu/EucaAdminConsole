define([
    'app',
    'views/searches/generic',
    'views/searches/tagsearch'
], function(app, Search, TagSearch) {
  return function(walrus) {
    var config = {
      facets : ['all_text'],
      localize: {
        all_text: app.msg('search_facet_alltext')
      }
    }
    return new Search(walrus, new TagSearch(config, walrus));
  }
});
