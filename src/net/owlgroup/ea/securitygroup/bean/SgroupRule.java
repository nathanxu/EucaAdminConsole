package net.owlgroup.ea.securitygroup.bean;

import java.util.ArrayList;

public class SgroupRule {
String from_port = "22"; 
String ip_protocol = "tcp"; 
String parent = null; 
String to_port = "22"; 
String __obj_name__ = "IPPermissions"; 
String item = ""; 
ArrayList<SgroupRuleGrant> grants = new ArrayList<SgroupRuleGrant>();
String ipRanges = ""; 
String groups = "";

}
