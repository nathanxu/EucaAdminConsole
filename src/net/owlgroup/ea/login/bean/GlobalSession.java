package net.owlgroup.ea.login.bean;

public class GlobalSession {
    String admin_console_url = "http://your-cloud-admin-portal/";
    String admin_support_url = "http://your-cloud-admin-portal/";
    String help_url = "https://engage.eucalyptus.com?r=euca-";
    String version = "3.3.0.1";
    String language = "zh_CN";
    Object instance_type;
    
    public String getAdmin_console_url() {
        return admin_console_url;
    }
    public void setAdmin_console_url(String admin_console_url) {
        this.admin_console_url = admin_console_url;
    }
    public String getAdmin_support_url() {
        return admin_support_url;
    }
    public void setAdmin_support_url(String admin_support_url) {
        this.admin_support_url = admin_support_url;
    }
    public String getHelp_url() {
        return help_url;
    }
    public void setHelp_url(String help_url) {
        this.help_url = help_url;
    }
    public String getVersion() {
        return version;
    }
    public void setVersion(String version) {
        this.version = version;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public Object getInstance_type() {
        return instance_type;
    }
    public void setInstance_type(Object instance_type) {
        this.instance_type = instance_type;
    }

}
