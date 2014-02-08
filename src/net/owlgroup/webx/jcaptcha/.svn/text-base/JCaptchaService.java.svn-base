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

package net.owlgroup.webx.jcaptcha;

import com.octo.captcha.service.captchastore.FastHashMapCaptchaStore;
import com.octo.captcha.service.image.DefaultManageableImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/**
 * JCaptchaService
 * <p>
 * Date: 2012-08-25,00:11:44 +0800
 * 
 * @author Song Sun
 * @version 1.0
 */
public class JCaptchaService {
    private static final ImageCaptchaService instance = new DefaultManageableImageCaptchaService(
        new FastHashMapCaptchaStore(), new DefaultImageCaptchaEngine(), 180,
        1000, 750);

    public static ImageCaptchaService getInstance() {
        return instance;
    }

}
