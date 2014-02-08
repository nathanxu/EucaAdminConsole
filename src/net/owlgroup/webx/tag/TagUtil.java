/*-
 * Copyright 2012 Owl Group
 * All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 */

package net.owlgroup.webx.tag;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.citrus.util.StringEscapeUtil;
import com.alibaba.citrus.webx.util.WebxUtil;

/**
 * TagUtil
 * <p>
 * Date: 2012-08-23,17:38:56 +0800
 * 
 * @author Song Sun
 * @version 1.0
 */
public class TagUtil {

    public static Object getBean(HttpServletRequest request, String name) {
        return WebxUtil.getCurrentComponent(request).getApplicationContext()
            .getBean(name);
    }

    @SuppressWarnings("unchecked")
    public static <T> T getBean(HttpServletRequest request, String name,
        Class<T> type) {
        if (type == null) {
            return (T) WebxUtil.getCurrentComponent(request)
                .getApplicationContext().getBean(name);
        }
        return WebxUtil.getCurrentComponent(request).getApplicationContext()
            .getBean(name, type);
    }

    public static String escapeJson(Object val) {
        if (val == null) {
            return null;
        }
        return StringEscapeUtil.escapeJavaScript(val.toString());
    }
}
