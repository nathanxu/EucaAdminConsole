package net.owlgroup.webx.i18n;

import java.io.InputStream;
import java.util.List;
import java.util.Locale;
import javax.servlet.ServletContext;

public class WebcontextResourceBundle extends PropertyResourceBundle {
    public WebcontextResourceBundle(Locale l, ServletContext sc, String res) {
        setLocale(l);
        List<String> list = caculateNameList(res, l);
        InputStream in = null;
        for (int i = list.size() - 1; i >= 0; i--) {
            String str = (String) list.get(i) + ".properties";
            if (!str.startsWith("/"))
                str = "/" + str;
            in = sc.getResourceAsStream(str);
            if (in != null)
                break;
        }
        if (in != null)
            load(in);
    }
}