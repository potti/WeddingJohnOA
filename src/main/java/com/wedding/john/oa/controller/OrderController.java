package com.wedding.john.oa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.Order;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.services.OrderService;

@Controller
@SessionAttributes({ "user" })
public class OrderController {

	@Autowired
	private OrderService orderService;

	@RequestMapping(method = RequestMethod.POST, value = "/order")
	@ResponseBody
	public int createOrder(@RequestBody Order order,@ModelAttribute("user") User user) {
		return 0;
	}
}
