EucaAdminConsole
================

Eucalyptus admin console for cloud account and infra admin.

Compile
============
This project is compiled by eclipse, please download the source codes from git hub and import it to eclipse.
In eclipse, please install tomcat plugin first (using tomcat 6.0.37)

tomcat WAR file exporting setting in Eclipse
Project -> Properties -> tomcat -> Export to WAR setting.

Generate WAR file
Tomcat Project -> Export WAR file set in project properties


Install tomcat server
============

1) install tomcat server.

install tomcat server. please donwload the pre confiugred tomcat server from https://github.com/nathanxu/EucaAdminConsole_TomcatServer.git

\# git clone https://github.com/nathanxu/EucaAdminConsole_TomcatServer.git

uncompress the tarball "apache-tomcat.tar.gz" to the target directory.

\# tar zxf apache-tomcat.tar.gz

Deploy WAR to tomcat
===========
to deploy the WAR file to tomcat, please copy the WAR file tomcat server, please delete all files and dirs in
the ROOT directory of web apps ($Home direcotry of tomcat/webapps/ROOT)
then copy the WAR file to this ROOT directory and uncompress it.

\# jar vxf euca-admin.war

Configuration
===========
To configure the web application, please configure the property file in this directory:
webapps/ROOT/WEB-INF/classes/app.properties

\#the ip of cloud controler server
-Dapi.clcIp=192.168.1.100
\# clc server port
-Dapi.clcPort=8773

\#access key of eucalyptus system admin
-Dapi.accessKey=IU5NTJEYZJ1DMBB84UKAF

\#secretkey key of eucalyptus system admin
-Dapi.secretKey=8Ek1e2tHO0D6gwaCNodKMSd3qUdWJ9wm3p2iqvEp

\#root account of the clc server
-Dapi.clcUser=root
-Dapi.clcPassword=

\# default user account for login into CC to update the eucalyptus configuration file
-Dapi.ccDefaultUser=root
-Dapi.ccDefaultUserPassword=

\# language of console

-Deuca.language=en_US

\# directory to store temporary files 
-DCredentialDir=/tmp
