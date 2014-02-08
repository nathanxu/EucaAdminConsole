define([
    'app',
    'views/searches/generic',
    'views/searches/tagsearch'
], function(app, Search, TagSearch) {
  return function(report) {
    var config = {
      facets : ['all_text','account','user','zone'],
      localize: {
        all_text: app.msg('search_facet_alltext'),
        account: app.msg('title_report_s3_account'),
        user: app.msg('title_report_s3_user'),
        zone: app.msg('title_report_instance_zone')
      }
    };
    return new Search(report, new TagSearch(config, report));
  };
});
