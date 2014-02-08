define([
    'underscore',
    'backbone',
    'sharedtags',
    
    'models/configurecloud_loadbalancers',
    'models/configurecloud_cloudproperties',
    'models/configurecloud_vmtypes',
    'models/configurecloud_ebsservices',
    'models/configurecloud_s3s',
    'models/configurecloud_dnsservices',
    'models/configurecloud_loadbalancers',

    'models/cloudmanagement_accounts',
    'models/cloudmanagement_users',
    'models/cloudmanagement_usergroups',
    'models/cloudmanagement_policys',
    'models/cloudmanagement_credentials',
    'models/cloudmanagement_manageimages',
    'models/cloudmanagement_healthcheckings',
    'models/cloudmanagement_capacityreports',
    'models/cloudmanagement_s3reports',
    'models/cloudmanagement_instancereports',
    'models/cloudmanagement_volumereports',
    'models/cloudmanagement_ipreports',
    
    'models/infrastructure_ccs',
    'models/infrastructure_scs',
    'models/infrastructure_vmwarebrokers',
    'models/infrastructure_nodes',
    'models/infrastructure_clcs',
    'models/infrastructure_walruses',
    'models/infrastructure_storages'
	], 
function(_, Backbone, tags) {
    var self = this;
    var sconfs = [
	
	['configurecloud_loadbalancer', 'configurecloud_loadbalancers'],
	['configurecloud_cloudproperty', 'configurecloud_cloudproperties'],
	['configurecloud_vmtype', 'configurecloud_vmtypes'],
	['configurecloud_ebsservice', 'configurecloud_ebsservices'],
	['configurecloud_s3', 'configurecloud_s3s'],
	['configurecloud_dnsservice', 'configurecloud_dnsservices'],
	['configurecloud_loadbalancer', 'configurecloud_loadbalancers'],

	['cloudmanagement_account', 'cloudmanagement_accounts'],
	['cloudmanagement_user', 'cloudmanagement_users'],
	['cloudmanagement_usergroup', 'cloudmanagement_usergroups'],
	['cloudmanagement_policy', 'cloudmanagement_policys'],
	['cloudmanagement_credential', 'cloudmanagement_credentials'],
	['cloudmanagement_manageimage', 'cloudmanagement_manageimages'],
    ['cloudmanagement_healthchecking', 'cloudmanagement_healthcheckings'],
    ['cloudmanagement_capacityreport', 'cloudmanagement_capacityreports'],
    ['cloudmanagement_s3report', 'cloudmanagement_s3reports'],
    ['cloudmanagement_instancereport', 'cloudmanagement_instancereports'],
    ['cloudmanagement_volumereport', 'cloudmanagement_volumereports'],
    ['cloudmanagement_ipreport', 'cloudmanagement_ipreports'],
    
	['infrastructure_cc', 'infrastructure_ccs'],
	['infrastructure_sc', 'infrastructure_scs'],
	['infrastructure_vmwarebroker', 'infrastructure_vmwarebrokers'],
	['infrastructure_node', 'infrastructure_nodes'],
    ['infrastructure_clc', 'infrastructure_clcs'],
    ['infrastructure_walrus', 'infrastructure_walruses'],
    ['infrastructure_storage', 'infrastructure_storages']
    ];

    var shared = {};
    var args = arguments;
    var srcs = _.map(_.range(3, args.length), function(n) { 
        return args[n]; 
    });
    _.each(srcs, function(src, index) {
       var clz = srcs[index];
       var obj = new clz();
       _.each(sconfs[index], function(name) {
           shared[name] = obj;
       });
    });

    shared.tags = tags;
    shared.tag = tags;
 
	return shared;
});
