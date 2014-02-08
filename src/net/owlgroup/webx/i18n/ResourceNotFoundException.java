package net.owlgroup.webx.i18n;

import java.util.Locale;

public class ResourceNotFoundException extends RuntimeException {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6937040269009559752L;

    public ResourceNotFoundException(String res, Locale l) {
        super("Resource Not Found[" + res + "][" + l + "]!");
    }
}