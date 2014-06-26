package com.wedding.john.oa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.wedding.john.oa.services.OrderService;

@Controller
public class OrderController {

	@Autowired
	private OrderService orderService;

	@RequestMapping(method = RequestMethod.GET, value = "/index/{id}")
	public String index(@PathVariable String id,
			@RequestParam("age") String age, Model model) {
		model.addAttribute("name", orderService.say(id));
		model.addAttribute("age", age);
		return "index";
	}
}
