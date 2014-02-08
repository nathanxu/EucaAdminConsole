package net.owlgroup.webx.i18n;

import java.lang.ref.SoftReference;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.PageContext;

public abstract class ResourceBundle {
    private static Map<Locale, SoftReference<Map<String, ResourceBundle>>> cache = new HashMap<Locale, SoftReference<Map<String, ResourceBundle>>>();
    private Locale locale = null;
    private ResourceBundle parent = null;
    private ResourceBundle server = null;

    private static ResourceBundle getFromCache(Locale l, String name) {
        SoftReference<Map<String, ResourceBundle>> localSoftReference = cache
            .get(l);
        if ((localSoftReference != null) && (localSoftReference.get() != null))
            return (ResourceBundle) (localSoftReference.get()).get(name);
        return null;
    }

    private static synchronized void putInCache(Locale l, String key,
        ResourceBundle rb) {
        SoftReference<Map<String, ResourceBundle>> sr = cache.get(l);
        if ((sr == null) || (sr.get() == null)) {
            sr = new SoftReference<Map<String, ResourceBundle>>(
                new HashMap<String, ResourceBundle>());
            cache.put(l, sr);
        }
        sr.get().put(key, rb);
    }

    protected static List<String> caculateNameList(String res, Locale l) {
        ArrayList<String> list = new ArrayList<String>(10);
        String lang = l.getLanguage();
        int i = lang.length();
        String cn = l.getCountry();
        int j = cn.length();
        String vari = l.getVariant();
        int k = vari.length();
        list.add(res);
        if (i + j + k == 0)
            return list;
        StringBuffer buf = new StringBuffer(res);
        buf.append('_');
        buf.append(lang);
        if (i > 0)
            list.add(buf.toString());
        if (j + k == 0)
            return list;
        buf.append('_');
        buf.append(cn);
        if (j > 0)
            list.add(buf.toString());
        if (k == 0)
            return list;
        buf.append('_');
        buf.append(vari);
        list.add(buf.toString());
        return list;
    }

    private static String getBaseName4JspDir(HttpServletRequest req) {
        String uri = req.getServletPath();
        Object jsp = req.getAttribute("webx.CurrentJspPath");
        if (jsp instanceof String) {
            uri = (String) jsp;
        }
        if (!uri.endsWith(".jsp")) {
            throw new IllegalStateException("Not a jsp request! " + uri);
        }
        int idx = uri.lastIndexOf('/');
        uri = uri.substring(0, idx + 1);
        if (uri.equals(""))
            return "/resources";
        return uri + "resources";
    }

    private static String getBaseName4JspFile(HttpServletRequest req) {
        String uri = req.getRequestURI();
        String path = req.getContextPath();
        if (!uri.endsWith(".jsp"))
            throw new IllegalStateException("It's not a jsp request!");
        if (!uri.startsWith("/"))
            uri = "/" + uri;
        if ((path == null) || (path.equals("")))
            path = "/";
        int i = uri.lastIndexOf(".jsp");
        if (path.equals("/"))
            uri = uri.substring(1, i);
        else
            uri = uri.substring(path.length() + 1, i);
        return uri;
    }

    private static String getBaseName4Class(Class<?> clazz) {
        return clazz.getName();
    }

    private static String getBaseName4Package(Class<?> clazz) {
        Package p = clazz.getPackage();
        if (p == null)
            return "resources";
        return p.getName() + ".resources";
    }

    private static ClasspathResourceBundle getRootClasspathBundle(
        ClassLoader cl, Locale l) {
        ResourceBundle rb = getFromCache(l, "class:root");
        if (rb == null) {
            rb = new ClasspathResourceBundle(l, cl, "resources");
            putInCache(l, "class:root", rb);
        }
        return (ClasspathResourceBundle) rb;
    }

    private static WebcontextResourceBundle getRootWebcontextBundle(
        ServletContext sc, Locale l) {
        ResourceBundle rb = getFromCache(l, "webcontext:root");
        if (rb == null) {
            rb = new WebcontextResourceBundle(l, sc, "/jsp/public/resources");
            putInCache(l, "webcontext:root", rb);
        }
        return (WebcontextResourceBundle) rb;
    }

    public ResourceBundle getServerBundle() {
        return this.server;
    }

    protected void setServerBundle(ResourceBundle rb) {
        this.server = rb;
    }

    public Iterator<String> getKeys() {
        return null;
    }

    public String get(String key) {
        String str = handleGetObject(key);
        if ((str == null) && (this.parent != null))
            return this.parent.get(key);
        return str;
    }

    protected abstract String handleGetObject(String paramString);

    public String get(String key, Object[] objs) {
        String str = get(key);
        try {
            return MessageFormat.format(str, objs);
        } catch (Throwable t) {
            t.printStackTrace();
        }
        return key;
    }

    public Locale getLocale() {
        return this.locale;
    }

    public ResourceBundle getParent() {
        return this.parent;
    }

    protected void setParent(ResourceBundle rb) {
        this.parent = rb;
    }

    protected void setLocale(Locale l) {
        this.locale = l;
    }

    public static ResourceBundle getClassBundle(Class<?> clazz) {
        String str = getBaseName4Class(clazz);
        ClassLoader cl = clazz.getClassLoader();
        Locale l = LocaleHolder.getLocale();
        return getClasspathBundle(cl, str, l);
    }

    public static ResourceBundle getClassBundle(Class<?> clazz, Locale l) {
        String str = getBaseName4Class(clazz);
        ClassLoader cl = clazz.getClassLoader();
        return getClasspathBundle(cl, str, l);
    }

    public static ResourceBundle getPackageBundle(Class<?> clazz) {
        String str = getBaseName4Package(clazz);
        ClassLoader cl = clazz.getClassLoader();
        Locale l = LocaleHolder.getLocale();
        return getClasspathBundle(cl, str, l);
    }

    public static ResourceBundle getPackageBundle(Class<?> clazz, Locale l) {
        String str = getBaseName4Package(clazz);
        ClassLoader cl = clazz.getClassLoader();
        return getClasspathBundle(cl, str, l);
    }

    public static ResourceBundle getPackageBundle(Class<?> clazz,
        boolean deftLocal) {
        String str = getBaseName4Package(clazz);
        ClassLoader cl = clazz.getClassLoader();
        if (deftLocal)
            return getClasspathBundle(cl, str, Locale.getDefault());
        Locale l = LocaleHolder.getLocale();
        return getClasspathBundle(cl, str, l);
    }

    public static ResourceBundle getClasspathBundle(ClassLoader cl, String res,
        Locale l) {
        ResourceBundle rb = getFromCache(l, res);
        if (rb == null) {
            rb = new ClasspathResourceBundle(l, cl, res);
            if (!res.equals("resources"))
                rb.setParent(getRootClasspathBundle(cl, l));
            Locale localLocale = Locale.getDefault();
            if (l.equals(localLocale)) {
                rb.setServerBundle(rb);
            } else {
                ResourceBundle localResourceBundle = getClasspathBundle(cl,
                    res, localLocale);
                rb.setServerBundle(localResourceBundle);
            }
            putInCache(l, res, rb);
        }
        return rb;
    }

    public static ResourceBundle getJspBundle(HttpServletRequest req,
        PageContext pc) {
        String str = getBaseName4JspFile(req);
        ServletContext sc = pc.getServletContext();
        Locale l = req.getLocale();
        return getWebcontextBundle(sc, str, l);
    }

    public static ResourceBundle getJspBundle(HttpServletRequest req,
        PageContext pc, Locale l) {
        String str = getBaseName4JspFile(req);
        ServletContext sc = pc.getServletContext();
        return getWebcontextBundle(sc, str, l);
    }

    public static ResourceBundle getJspDirBundle(HttpServletRequest req,
        PageContext pc, Locale l) {
        String str = getBaseName4JspDir(req);
        ServletContext sc = pc.getServletContext();
        return getWebcontextBundle(sc, str, l);
    }

    public static ResourceBundle getJspDirBundle(HttpServletRequest req,
        PageContext pc) {
        String str = getBaseName4JspDir(req);
        ServletContext sc = pc.getServletContext();
        Locale l = req.getLocale();
        return getWebcontextBundle(sc, str, l);
    }

    public static ResourceBundle getWebcontextBundle(ServletContext sc,
        String res, Locale local) {
        ResourceBundle rb = getFromCache(local, res);
        if (rb == null) {
            rb = new WebcontextResourceBundle(local, sc, res);
            // if (!res.equals("resources"))
            // rb.setParent(getRootWebcontextBundle(sc, local));
            Locale l = Locale.getDefault();
            if (local.equals(l)) {
                rb.setServerBundle(rb);
            } else {
                rb.setServerBundle(getWebcontextBundle(sc, res, l));
            }
            putInCache(local, res, (ResourceBundle) rb);
        }
        return (ResourceBundle) rb;
    }

    public static void clearCache() {
        cache.clear();
    }
}