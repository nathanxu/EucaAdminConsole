package net.owlgroup.webx.jcaptcha;

import java.awt.Color;
import java.awt.Font;
import java.awt.image.ImageFilter;

import com.octo.captcha.component.image.backgroundgenerator.BackgroundGenerator;
import com.octo.captcha.component.image.backgroundgenerator.UniColorBackgroundGenerator;
import com.octo.captcha.component.image.color.RandomListColorGenerator;
import com.octo.captcha.component.image.deformation.ImageDeformation;
import com.octo.captcha.component.image.deformation.ImageDeformationByFilters;
import com.octo.captcha.component.image.fontgenerator.FontGenerator;
import com.octo.captcha.component.image.fontgenerator.RandomFontGenerator;
import com.octo.captcha.component.image.textpaster.DecoratedRandomTextPaster;
import com.octo.captcha.component.image.textpaster.TextPaster;
import com.octo.captcha.component.image.textpaster.textdecorator.TextDecorator;
import com.octo.captcha.component.image.wordtoimage.DeformedComposedWordToImage;
import com.octo.captcha.component.image.wordtoimage.WordToImage;
import com.octo.captcha.component.word.wordgenerator.RandomWordGenerator;
import com.octo.captcha.component.word.wordgenerator.WordGenerator;
import com.octo.captcha.engine.image.ListImageCaptchaEngine;
import com.octo.captcha.image.gimpy.GimpyFactory;

public class DefaultImageCaptchaEngine extends ListImageCaptchaEngine {
    protected void buildInitialFactories() {
        WordGenerator wgen = new RandomWordGenerator("0123456789");
        TextPaster rp = new DecoratedRandomTextPaster(4, 4,
            new RandomListColorGenerator(new Color[] { new Color(123, 240, 57),
                new Color(250, 184, 71), Color.decode("#efcfaf") }),
            new TextDecorator[] {});
        BackgroundGenerator bg = new UniColorBackgroundGenerator(80, 30,
            Color.decode("#51779D"));
        bg = new TransparencyBackgroundGenerator(80, 30);
        FontGenerator font = new RandomFontGenerator(new Integer(15),
            new Integer(15), new Font[] { new Font("Arial", 0, 15),
                new Font("Tahoma", 0, 15), new Font("Verdana", 0, 15), });

        ImageDeformation postDef = new ImageDeformationByFilters(
            new ImageFilter[] {});
        ImageDeformation backDef = new ImageDeformationByFilters(
            new ImageFilter[] {});
        ImageDeformation textDef = new ImageDeformationByFilters(
            new ImageFilter[] {});

        WordToImage word2image = new DeformedComposedWordToImage(font, bg, rp,
            backDef, textDef, postDef);
        addFactory(new GimpyFactory(wgen, word2image));
    }
}
