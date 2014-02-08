package net.owlgroup.webx.i18n;

import java.io.InputStream;
import java.util.List;
import java.util.Locale;

public class ClasspathResourceBundle extends PropertyResourceBundle {
    public ClasspathResourceBundle(Locale locale, ClassLoader cl, String res) {
        setLocale(locale);
        List<String> list = caculateNameList(res, locale);
        InputStream in = null;
        for (int i = list.size() - 1; i >= 0; i--) {
            String str = ((String) list.get(i)).replace('.', '/')
                + ".properties";
            in = cl.getResourceAsStream(str);
            if (in != null)
                break;
        }
        if (in == null)
            throw new ResourceNotFoundException(res, locale);
        load(in);
    }
}