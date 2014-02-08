package net.owlgroup.webx.i18n;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class PropertyResourceBundle extends ResourceBundle {
    private Map<String, String> lookup = new HashMap<String, String>();
    static final Log log = LogFactory.getLog(PropertyResourceBundle.class);

    protected void load(InputStream in) {
        BufferedReader br = null;
        try {
            Properties p = new Properties();
            p.load(in);
            Enumeration<?> e = p.propertyNames();
            while (e.hasMoreElements()) {
                String key = (String) e.nextElement();
                lookup.put(key, p.getProperty(key));
            }
        } catch (IOException e) {
            log.error(e);
        } finally {
            try {
                if (br != null)
                    br.close();
            } catch (IOException e) {
                log.error(e);
            }
        }
    }

    protected void load1(InputStream in) {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String str = null;
            while ((str = br.readLine()) != null) {
                str = str.trim();
                if ((str.startsWith("#")) || (str.equals("")))
                    continue;
                String[] strs = str.split("=", 2);
                if (strs.length == 1) {
                    this.lookup.put(strs[0], "");
                    continue;
                }
                this.lookup.put(strs[0], strs[1]);
            }
        } catch (IOException e) {
            log.error(e);
        } finally {
            try {
                if (br != null)
                    br.close();
            } catch (IOException e) {
                log.error(e);
            }
        }
    }

    public String handleGetObject(String paramString) {
        return (String) this.lookup.get(paramString);
    }

    public Iterator<String> getKeys() {
        return this.lookup.keySet().iterator();
    }
}