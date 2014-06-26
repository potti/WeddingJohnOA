package com.wedding.john.oa.services;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

	public String say(String param) {
		return "hello " + param;
	}
}
