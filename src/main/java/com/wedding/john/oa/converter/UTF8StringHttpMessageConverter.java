package com.wedding.john.oa.converter;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;

public class UTF8StringHttpMessageConverter extends StringHttpMessageConverter {

	public UTF8StringHttpMessageConverter(Charset defaultCharset) {
		List<MediaType> mediaTypeList = new ArrayList<MediaType>();
		mediaTypeList.add(new MediaType("text", "plain", defaultCharset));
		mediaTypeList.add(MediaType.ALL);
		super.setSupportedMediaTypes(mediaTypeList);
	}

}
