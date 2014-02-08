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

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import com.octo.captcha.component.image.backgroundgenerator.BackgroundGenerator;

/**
 * TransparencyBackgroundGenerator
 * <p>
 * Date: 2012-10-11,17:36:13 +0800
 * 
 * @author Song Sun
 * @version 1.0
 */
public class TransparencyBackgroundGenerator implements BackgroundGenerator {
    int width, height;

    TransparencyBackgroundGenerator(Integer width, Integer height) {
        this.width = width;
        this.height = height;
    }

    public BufferedImage getBackground() {
        BufferedImage img = new BufferedImage(width, height,
            BufferedImage.TYPE_INT_ARGB);
        // Graphics2D g = (Graphics2D) img.createGraphics();
        // g.setColor(Color.decode("#ABCDEF"));
        // g.drawRect(0, 0, width - 1, height - 1);
        return img;
    }

    public int getImageHeight() {
        return width;
    }

    public int getImageWidth() {
        return height;
    }

}
